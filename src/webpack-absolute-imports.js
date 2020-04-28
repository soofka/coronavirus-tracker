const fs = require('fs');
const path = require('path');

const getAbsoluteImportMappings = (sources) => {
  const sourcesArray = Array.isArray(sources) ? sources : [sources];
  const aliases = {};

  sourcesArray.forEach((source) => {
    const sourcePath = path.resolve(source);

    fs.readdirSync(sourcePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .forEach((directory) => {
        aliases[directory] = path.join(sourcePath, directory);
      });
  });

  return aliases;
};

module.exports = { getAbsoluteImportMappings };
