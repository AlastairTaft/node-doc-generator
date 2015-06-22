
var generate = require(__dirname + '/../copyFiles.js');

generate([
  "@alastair/pbx-ui",
  "@alastair/pbx-api"
], __dirname + "/generated-docs"
 , 'json'
 , __dirname + "/../examples/template/template.html");