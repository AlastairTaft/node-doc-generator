var Lab = require('lab');
var lab = exports.lab = Lab.script();
var assert = require('assert');

var spawn = require('child_process').spawn;

var assertRendered = require('./fixtures/assert.json')

lab.experiment('doc generation', function() {

  lab.test('it renders html from *.md files', function(done) {
    var files = [__dirname + '/fixtures/md/index.md'];

    generate('html', files, function(err, buf) {
      var res = /<h2>hello from index.md/.test(buf.toString());
      assert.ok(res, 'should render .md files');
      done();
    });
  });

  lab.test('it processes includes from *.md files', function(done) {
    var files = [__dirname + '/fixtures/md/index.md'];

    generate('html', files, function(err, buf) {
      var res = /<h2>Hello from include with md-fileending!/;
      assert.ok(res.test(buf.toString()), 'should render .md includes');
      done();
    });
  });

  lab.test('it renders html from *.markdown files', function(done) {
    var files = [__dirname + '/fixtures/markdown/index.markdown'];

    generate('html', files, function(err, buf) {
      var res = /<h2>hello from index.markdown/.test(buf.toString());
      assert.ok(res, 'should render .markdown');
      done();
    });
  });

  lab.test('it processes includes from *.markdown files', function(done) {
    var files = [__dirname + '/fixtures/markdown/index.markdown'];

    generate('html', files, function(err, buf) {
      var res = /<h2>Hello from include with markdown-fileending!/.test(buf.toString());
      assert.ok(res, 'should render .markdown includes');
      done();
    });
  });

  lab.test('it processes includes with an explicit fileending', function(done) {
    var files = [__dirname + '/fixtures/include-with-file-ending/index.markdown'];

    generate('html', files, function(err, buf) {
      var res = /<h2>Hello from _toc.markdown/.test(buf.toString());
      assert.ok(res, 'should render .markdown includes with a defined fileending');
      done();
    });
  });

  lab.test('it renders html from *.md files with a config', function(done) {
    var files = [__dirname + '/fixtures/md-with-config/rocko-artischocko.md'];

    generate('html', files, function(err, buf) {
      var res = /Hello from Custom-Template/.test(buf.toString());
      assert.ok(res, 'should render .md files with config #1');
      var res2 = /Rocko writes Node.js/.test(buf.toString());
      assert.ok(res2, 'should render .md files with config #2');

      done();
    });
  });

  lab.test('it renders json from *.md files with a config', function(done) {
    var files = [__dirname + '/fixtures/assert.markdown'];

    generate('json', files, function(err, buf) {
      var res = JSON.parse(buf.toString());
      delete res.source
      console.error();
      assert.deepEqual(assertRendered, res);
      done();
    });
  });
});


function generate(format, files, cb) {
  var buffer = '',
      child;

  child = spawn(__dirname + '/../generate.js', [
    '--format=' + format,
    '--template=' + __dirname + '/fixtures/template.html'
  ].concat(files));

  child.stdout.on('data', function(chunk) {
    buffer += chunk;
  });

  child.on('close', function () {
    cb(null, buffer);
  });
}
