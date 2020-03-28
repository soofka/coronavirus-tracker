const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const JSDOM = require('jsdom').JSDOM;
const countryCodes = require('../node_modules/country-json/src/country-by-abbreviation.json');

const SOURCE_WEBSITE_URL = 'https://ourworldindata.org/coronavirus-testing-source-data';

fetch(SOURCE_WEBSITE_URL)
  .then((response) => response.text())
  .then((html) => {
    const dom = new JSDOM(html);
    const countryTestsRaw = Array.from(dom.window.document.querySelectorAll('table tr'))
    const countryTests = {};

    countryTestsRaw.forEach((tr) => {
      const tds = Array.from(tr.querySelectorAll('td'));
      const countryName = tds[0].textContent.split('–')[0].trim();
      const country = countryCodes.find(
        (tempCountryCode) => tempCountryCode.country === countryName);

      if (country && country.abbreviation) {
        const countryCode = country.abbreviation;
        const countryTestsCount = parseInt(tds[1].textContent.replace(',', ''), 10);

        if (!isNaN(countryTestsCount)) {
          (countryTests[countryCode] && !isNaN(countryTests[countryCode]))
            ? countryTests[countryCode] += countryTestsCount
            : countryTests[countryCode] = countryTestsCount;
        }
      }
    });

    fs.writeFileSync(path.join(__dirname, '../static/data/virus-tests.json'), JSON.stringify(countryTests));
  })
  .catch((error) => console.error(error));