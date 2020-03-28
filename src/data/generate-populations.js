const fs = require('fs');
const path = require('path');

const countryCodes = require('../node_modules/country-json/src/country-by-abbreviation.json');
const countryPopulations = require('../node_modules/country-json/src/country-by-population.json');

console.log('test', countryCodes, countryPopulations);

const codePopulations = {
  total: 0,
};
countryPopulations.forEach((countryPopulation) => {
  const countryCode = countryCodes.find((tempCountryCode) => tempCountryCode.country === countryPopulation.country);
  if (countryCode && countryCode.abbreviation && countryPopulation.population) {
    codePopulations[countryCode.abbreviation] = countryPopulation.population;
    codePopulations.total += parseInt(countryPopulation.population, 10);
  }
});

fs.writeFileSync(path.join(__dirname, '../static/data/populations.json'), JSON.stringify(codePopulations));
