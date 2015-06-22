var fs = require('fs');
var path = require('path');


module.exports = function getConfigForMarkdownFile(inputFile) {
  var configDir = path.dirname(inputFile);
  var extName = path.extname(inputFile);
  var configFile = path.basename(inputFile, extName) + '.json';

  configFile = path.join(configDir, configFile);
  console.error('checking for', configFile);
  var configObj = {};
  if (fs.existsSync(configFile))
    configObj = JSON.parse(fs.readFileSync(configFile))

  return configObj;
}
