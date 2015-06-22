var Lab = require('lab');
var lab = exports.lab = Lab.script();
var assert = require('assert');

var getConfigForMarkdownFile = require('./../lib/get-config-for-markdown-file.js');

lab.experiment('get-config-for-markdown-file', function() {

  lab.test('returns an empty object if no config present', function(done) {
    var result = getConfigForMarkdownFile('not-exists', 'md');
    assert.deepEqual({}, result);
    done();
  });

  lab.test('throws if a json config is invalid', function(done) {
    var input = __dirname + '/fixtures/invalid-json.md';
    assert.throws(function() {
      getConfigForMarkdownFile(input);
    }, Error);
    done();
  });

  lab.test('returns a config object if a config present', function(done) {
    var input = __dirname + '/fixtures/md-with-config/rocko-artischocko.md';
    var result = getConfigForMarkdownFile(input);
    assert.equal(result.rocko, 'artischocko', result);
    done();
  });
});
