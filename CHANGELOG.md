# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github.com/soofka/coronavirus-tracker/compare/v1.6.1...v1.7.0) (2020-06-22)


### Features

* added details to graph (number on hover and max value), fixed graph rendering ([071c760](https://github.com/soofka/coronavirus-tracker/commit/071c760ad13ac6924193d0883f64f9e133409d94))
* added new filters (data to display, new date ranges) ([2d95fdb](https://github.com/soofka/coronavirus-tracker/commit/2d95fdbf20ee2c3b7895e7d3edef821836ce6bf4))
* added weekly and monthly data granularity ([cf587c6](https://github.com/soofka/coronavirus-tracker/commit/cf587c697a495b4ff72abca08c3721f063f0e421))


### Bug Fixes

* added travis ci badge to readme ([1f4a1ca](https://github.com/soofka/coronavirus-tracker/commit/1f4a1caa7c1188c409e299524798b607e7a8ef66))
* brought back travis ci ([82b783a](https://github.com/soofka/coronavirus-tracker/commit/82b783a926d00dc8ce2f172ffbc15b9dcb135a8d))
* filtered out 0 values ([af1d1c4](https://github.com/soofka/coronavirus-tracker/commit/af1d1c429609a8ed2afd734b1d3ab2fcb32f0933))
* removed e2e tests from travis ([1183202](https://github.com/soofka/coronavirus-tracker/commit/11832028bb1581d9e18dde60b3ca827ef9498b23))

### [1.6.1](https://github.com/soofka/coronavirus-tracker/compare/v1.6.0...v1.6.1) (2020-04-29)


### Bug Fixes

* successfully removed local copy of netlify chromium plugin, added one from npm ([fd94683](https://github.com/soofka/coronavirus-tracker/commit/fd94683269e61d16889d25d75d96c0dd34266ae1))

## [1.6.0](https://github.com/soofka/coronavirus-tracker/compare/v1.5.0...v1.6.0) (2020-04-28)


### Features

* added basic Travis CI integration ([739fc8c](https://github.com/soofka/coronavirus-tracker/commit/739fc8c5bea57ad1cfd4160b1f8ff58923a5c41e))
* added Lighthouse tests to Netlify CI/CD with custom netlify-chromium-plugin ([6c9fe31](https://github.com/soofka/coronavirus-tracker/commit/6c9fe31730c377454983e55ab32bc61173503d7b))
* added Netlify and Coveralls status badges to README ([453c364](https://github.com/soofka/coronavirus-tracker/commit/453c364697f4b963c6474af33121109d80f9c92e))
* added unit tests coverage calculation to CI/CD ([fd21417](https://github.com/soofka/coronavirus-tracker/commit/fd21417941b70de9662ece3604c884b9cb65c8f9))

## [1.5.0](https://github.com/soofka/coronavirus-tracker/compare/v1.4.1...v1.5.0) (2020-04-06)


### Features

* added absolute change value compared to previous day to data display and graph ([b400cee](https://github.com/soofka/coronavirus-tracker/commit/b400ceeb03b50ca7c7512be564e3b55e9c3aefa5))
* added basic date range filters to chart ([09c6d6a](https://github.com/soofka/coronavirus-tracker/commit/09c6d6a92517e5b95f08877bee1f81231609485f))

### [1.4.1](https://github.com/soofka/coronavirus-tracker/compare/v1.4.0...v1.4.1) (2020-04-05)


### Bug Fixes

* clarified trend description in case of no change ([4cde57c](https://github.com/soofka/coronavirus-tracker/commit/4cde57cc8a69aea9304be559cca28d79a6f3db5c))
* set proper app name/title in all places ([e57de67](https://github.com/soofka/coronavirus-tracker/commit/e57de67909b78bc4b32dceb229d060c852ac34b3))

## [1.4.0](https://github.com/soofka/coronavirus-tracker/compare/v1.3.0...v1.4.0) (2020-04-05)


### Features

* added basic chart displaying historical virus data per region ([c725f17](https://github.com/soofka/coronavirus-tracker/commit/c725f17b1126712addca4b490fce7d0a5de50aa7))

## [1.3.0](https://github.com/soofka/coronavirus-tracker/compare/v1.2.0...v1.3.0) (2020-04-05)


### Features

* added color coding to trends ([4c7ed68](https://github.com/soofka/coronavirus-tracker/commit/4c7ed68013ac358249cffcf8f570585c8bf1a112))
* added comparison to previous data to virus data sections ([7317cbd](https://github.com/soofka/coronavirus-tracker/commit/7317cbd9fc6e829b0a868ff01f6b1ba247f53bc1))
* added explanation to percentage values in coronavirus data sections ([48b37f1](https://github.com/soofka/coronavirus-tracker/commit/48b37f1efa6ea27ced8670b35ef0d15a120a9b5f))


### Bug Fixes

* added '%' sign to change comapred to previous day ([88114ca](https://github.com/soofka/coronavirus-tracker/commit/88114ca4d2ca24d6ebe304e1ef90be9bb3c34036))
* added loading indication when historical data for previously selected country is available but historical data for currently selected country is being loaded ([ba058e3](https://github.com/soofka/coronavirus-tracker/commit/ba058e37f63938df93bd5ae8c11381e37bbba853))
* fixed days ago calculation in certain cases ([7e85c4d](https://github.com/soofka/coronavirus-tracker/commit/7e85c4d58c9f15fa9729d8b9d5f0adc4dbda750e))
* removed confusing elements of section headers ([8ea8352](https://github.com/soofka/coronavirus-tracker/commit/8ea835231a9132ac8e7ec320f2c54bb2d0a26830))
* set proper theme color ([31b3f72](https://github.com/soofka/coronavirus-tracker/commit/31b3f723097474e9767ff683ed584b3a36693ced))

## [1.2.0](https://github.com/soofka/coronavirus-tracker/compare/v1.1.0...v1.2.0) (2020-04-04)


### Features

* simplified UI, enhanced region and date selection, added last updated information, normalized data and numbers display ([6d74cb1](https://github.com/soofka/coronavirus-tracker/commit/6d74cb1be2e30aedb25e46df5a6df6576cad4585))

## [1.1.0](https://github.com/soofka/coronavirus-tracker/compare/v1.0.0...v1.1.0) (2020-03-31)


### Features

* added support for countries with multiple provinces ([99ef722](https://github.com/soofka/coronavirus-tracker/commit/99ef722326bfc83085b29e86e510d0f443a174a5))
* added verbosity to error indicator ([00adf57](https://github.com/soofka/coronavirus-tracker/commit/00adf5710d019ff362b0450a85e3ea3c7f340913))


### Bug Fixes

* display proper data in case of country with detailed data per province ([c4cad91](https://github.com/soofka/coronavirus-tracker/commit/c4cad91953f49a479522a84651bc65c498457067))

## [1.0.0](https://github.com/soofka/coronavirus-tracker/compare/v0.0.5...v1.0.0) (2020-03-29)


### Features

* added about section ([21fe99c](https://github.com/soofka/coronavirus-tracker/commit/21fe99ce89eee4d15159b6a43bad8c94ae26c834))


### Bug Fixes

* temporarily removed tests counts from all sections (unreliable/outdated data on the API side) ([4899651](https://github.com/soofka/coronavirus-tracker/commit/48996517388dc412600a96622278766df6959104))

### [0.0.5](https://github.com/soofka/coronavirus-tracker/compare/v0.0.4...v0.0.5) (2020-03-29)


### Bug Fixes

* temporarily disabled unreliable lighthouse rule ([a40e337](https://github.com/soofka/coronavirus-tracker/commit/a40e33799f6f5af3bffed905e2bb32e063744d18))
* temporarily removed recovered counts from all sections (lack of data on the API side) ([3baca3d](https://github.com/soofka/coronavirus-tracker/commit/3baca3d141b6a07fac07c43ca3d149a6793fab6c))

### [0.0.4](https://github.com/soofka/coronavirus-tracker/compare/v0.0.3...v0.0.4) (2020-03-29)


### Features

* added proper icons and descriptions for web and mobile ([3db1120](https://github.com/soofka/coronavirus-tracker/commit/3db112043594bdb6e44bff85bde2dcaf0eb40fde))


### Bug Fixes

* enabled latest country virus data section to access latest country virus tests data ([f74516e](https://github.com/soofka/coronavirus-tracker/commit/f74516ec785532a74b2a7910ef68302803e60413))
* fixed most performance/accessibility/pwa isses reported by Lighthouse ([2f6d50d](https://github.com/soofka/coronavirus-tracker/commit/2f6d50d6adc3fa9670ed7874bbdbce634dac5a0a))
* fixed remaining performance/accessibility/pwa issues reported by Lighthouse ([9690b91](https://github.com/soofka/coronavirus-tracker/commit/9690b9110eae684e2d5fe5d7154a7c6c5ab36dc7))
* installation button should disappear after installation ([c8a6c8b](https://github.com/soofka/coronavirus-tracker/commit/c8a6c8bd525d11999bbd774517b5b8a5e87fb184))
* updated content of static cache in service worker ([2077350](https://github.com/soofka/coronavirus-tracker/commit/2077350e23845dfa109a65b4421318f6db4404f2))

### [0.0.3](https://github.com/soofka/coronavirus-tracker/compare/v0.0.2...v0.0.3) (2020-03-28)


### Features

* added amount of virus tests performed per country ([19b2c1d](https://github.com/soofka/coronavirus-tracker/commit/19b2c1da088c545cddedc608d507564cf3ac64eb))

### [0.0.2](https://github.com/soofka/coronavirus-tracker/compare/v0.0.1...v0.0.2) (2020-03-28)


### Features

* reimplemented application in Preact ([7b018e9](https://github.com/soofka/coronavirus-tracker/commit/7b018e91c2d2d2cd60f8cb233c2f43438a204b9d))

### 0.0.1 (2020-03-20)


### Features

* configured basic compression of assets ([616b6b4](https://github.com/soofka/coronavirus-tracker/commit/616b6b40cfba813e0c1cfc09047f1bdc2716218b))
* implemented basic functionality ([4319a26](https://github.com/soofka/coronavirus-tracker/commit/4319a26f3d014d44450a53dcd1c0688e020119f7))


### Bug Fixes

* updated changelog ([a899041](https://github.com/soofka/coronavirus-tracker/commit/a899041765044943b583908142bda33e7d075490))
