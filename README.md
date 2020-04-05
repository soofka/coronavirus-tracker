# Coronavirus Tracker
Simple Preact PWA displaying latest information about coronavirus encounters around the world. Deployed to **https://trackcorona.today**.

## Where does the data come from?
Information about confirmed cases and deaths is fetched from [Coronavirus Tracker API](https://coronavirus-tracker-api.herokuapp.com/) ([github](https://github.com/ExpDev07/coronavirus-tracker-api)), which takes the data from [2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository](https://github.com/CSSEGISandData/COVID-19) by [Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)](https://systems.jhu.edu/). The data is updated on a daily basis.

## How can I contribute?
If you'd like to report a bug, propose a feature, help with translations, contribute to the code repository, feel free to [open an issue on Github](https://github.com/soofka/coronavirus-tracker/issues/new). If you want to say hi, [contact me on Twitter](https://twitter.com/pansoofka).

## TODO
### backlog
- make date arrows interact with query string and local storage through select
- fix double labels loading in case of non-default labels
- fix double historical data call (in case if country and region is set on entry)
- add advanced minification (closure compiler, better image minification, better css minification)
- get data about tests and enable related sections
- get data about recoveries and enable related sections
- preact-loadable?
- enable lighhouse tests in travis ci
- add travis to readme
- prerender default html
- npm packages reinstall and audit fix
- add social tags
- add global historical section
- add tests
- add coveralls
- add descriptions to chart
- add filters to chart
- add map
- remove main.css and main.js files from bundle
- add default language (if lack of label -> get default language -> put default labels)
- add content policy html webpack plugins
- change select with countries to input with autosuggest
- change select with dates to calendar-like date picker
- add css variables