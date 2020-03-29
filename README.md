# Coronavirus Tracker
Simple Preact PWA displaying latest information about coronavirus encounters around the world. Deployed to **https://amazing-morse-5b1303.netlify.com/**.

## Where does the data come from?
Information about confirmed cases and deaths is fetched from [Coronavirus Tracker API](https://coronavirus-tracker-api.herokuapp.com/) ([github](https://github.com/ExpDev07/coronavirus-tracker-api)), which takes the data from [2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository](https://github.com/CSSEGISandData/COVID-19) by [Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)](https://systems.jhu.edu/). The data is updated on a daily basis.

Information about country populations is fetched from [country-json](https://github.com/samayo/country-json) data repository, which aggregates the data from multiple different sources. The data is updated infrequently.

## How can I contribute?
If you'd like to report a bug, propose a feature, help with translations, contribute to the code repository, feel free to [open an issue on Github](https://github.com/soofka/coronavirus-tracker/issues/new). If you want to say hi, [contact me on Twitter](https://twitter.com/pansoofka).

## TODO
### first release
- add sections with explanation
- add readme
- release with semver to v1
### future
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
- add previous/next day buttons to historical data sections
- add previous day comparison to all data sections
- add tests
- add coveralls
- add country flags
- add graph
- add map
- add map link
- remove main.css and main.js files from bundle
- add default language (if lack of label -> get default language -> put default labels)
- add content policy html webpack plugins