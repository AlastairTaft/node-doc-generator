var Lab = require('lab');
var lab = exports.lab = Lab.script();
var assert = require('assert');

var getFileEnding = require('./../lib/find-markdown-file.js');

lab.experiment('find markdown files', function() {
  lab.test('returns an error for NON-existing files with defined md fileendings', function(done) {
    getFileEnding('rocko-artischocko.md', function(err, res) {
      var msgContains = /no file found/.test(err.message);
      assert.ok(msgContains, 'errormessage contains "no file found"');
      assert.ok(err, 'returns an error');
      done();
    });
  });

  lab.test('returns an error for NON-existing files with defined md fileendings', function(done) {
    getFileEnding('rocko-artischocko.markdown', function(err, res) {
      var msgContains = /no file found/.test(err.message);
      assert.ok(msgContains, 'errormessage contains "no file found"');
      assert.ok(err, 'returns an error');
      done();
    });
  });

  lab.test('if .markdown does exist and ending already given, returns file', function(done) {
    getFileEnding(__dirname + '/fixtures/markdown/index.markdown', function(err, res) {
      assert.equal(res, __dirname + '/fixtures/markdown/index.markdown');
      done();
    });
  });

  lab.test('if .md file does exist and ending already given, returns file', function(done) {
    getFileEnding(__dirname + '/fixtures/md/index.md', function(err, res) {
      assert.equal(res, __dirname + '/fixtures/md/index.md');
      done();
    });
  });

  lab.test('if .markdown file exists and ending NOT given, adds ending', function(done) {
    getFileEnding(__dirname + '/fixtures/markdown/index', function(err, res) {
      assert.equal(res, __dirname + '/fixtures/markdown/index.markdown');
      done();
    });
  });

  lab.test('if .md file exists and ending already given, adds ending', function(done) {
    getFileEnding(__dirname + '/fixtures/md/index', function(err, res) {
      assert.equal(res, __dirname + '/fixtures/md/index.md');
      done();
    });
  });

  lab.test('guessing fileendings: return an error if both endings are used', function(done) {
    getFileEnding(__dirname + '/fixtures/md-markdown/foo', function(err, res) {
      var msgContains = /\.md and \.markdown file exist/.test(err.message);
      assert.ok(msgContains, 'errormessage contains "no file found"');
      assert.ok(err, 'returns an error');
      done();
    });
  });

  lab.test('guessing fileendings: return an error if file does not exist',
    function(done) {
      getFileEnding(__dirname + '/doesnotexist', function(err, res) {
        var msgContains = /no file found/.test(err.message);
        assert.ok(msgContains, 'errormessage contains "no file found"');
        assert.ok(err, 'returns an error');
        done();
      });
  });
});
