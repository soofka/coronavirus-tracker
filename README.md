# Coronavirus Tracker
[![Netlify Status](https://api.netlify.com/api/v1/badges/98c27b94-6dce-4af4-90a4-312a64ef540e/deploy-status)](https://app.netlify.com/sites/amazing-morse-5b1303/deploys) [![Build Status](https://travis-ci.org/soofka/netlify-plugin-chromium.svg?branch=master)](https://travis-ci.org/soofka/netlify-plugin-chromium) [![Coverage Status](https://coveralls.io/repos/github/soofka/coronavirus-tracker/badge.svg)](https://coveralls.io/github/soofka/coronavirus-tracker)

Simple Preact PWA displaying latest information about coronavirus encounters around the world. Deployed to **https://trackcorona.today**.

## Where does the data come from?
Information about confirmed cases and deaths is fetched from [Coronavirus Tracker API](https://coronavirus-tracker-api.herokuapp.com/) ([github](https://github.com/ExpDev07/coronavirus-tracker-api)), which takes the data from [2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository](https://github.com/CSSEGISandData/COVID-19) by [Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)](https://systems.jhu.edu/). The data is updated on a daily basis.

## How can I contribute?
If you'd like to report a bug, propose a feature, help with translations, contribute to the code repository, feel free to [open an issue on Github](https://github.com/soofka/coronavirus-tracker/issues/new). If you want to say hi, [contact me on Twitter](https://twitter.com/pansoofka).

## TODO
### backlog
- animate chart properly
- fix unneeded calls for labels and historical data
- add chunk-splitting
- prerender default html
- npm packages reinstall and audit fix
- add social tags
- add snyk
- add proper virus map
- remove main.css and main.js files from bundle
- add default language (if lack of label -> get default language -> put default labels)
- add content policy html webpack plugins
- add country comparison
- add css variables
- add prettier
- add full unit tests coverage