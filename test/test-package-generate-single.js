
var generate = require(__dirname + '/../copyFiles.js');

generate([
  "@alastair/pbx-ui"
], __dirname + "/generated-docs"
 , 'html'
 , __dirname + "/../examples/template/template.html");