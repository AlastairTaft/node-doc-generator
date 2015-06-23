#!/usr/bin/env node
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var marked = require('marked');
var fs = require('fs');
var path = require('path');
var os = require('os');

var findMarkdownFile = require('./lib/find-markdown-file.js');
var getConfigForMarkdownFile = require('./lib/get-config-for-markdown-file.js');

var html = require('./html.js');
var json = require('./json.js');

var Generator = function(outputStream, format, template){
  this.outputStream = outputStream;
  this.template = template;
  this.format = format;
};

Generator.prototype.generate = function(inputFile, cb){
  var self = this;
  fs.readFile(inputFile, 'utf8', function(er, input) {
    if (er) throw er;
    // process the input for @include lines
    self.processIncludes(input, path.dirname(inputFile), function(err, input){
      self.next.call(self, err, input, inputFile, cb);
    });
  });
};




var includeExpr = /^@include\s+([A-Za-z0-9-_#@]+)(?:\.)?([a-zA-Z]*)$/gmi;
var includeData = {};
Generator.prototype.processIncludes = function(input, activeDir, cb) {
  debugger;
  var self = this;
  var includes = input.match(includeExpr);
  if (includes === null) return cb(null, input);
  var errState = null;
  console.error(includes);
  var incCount = includes.length;
  if (incCount === 0) cb(null, input);

  includes.forEach(function(include) {
    var fname = include.replace(/^@include\s+/, '');
    findMarkdownFile(path.resolve(activeDir, fname), function(err, file) {
      if (err) throw err;
      
      if (includeData.hasOwnProperty(file)) {
        input = input.split(include).join(includeData[file]);
        incCount--;
        if (incCount === 0) {
          return cb(null, input);
        }
        return;
      }

      var fullFname = path.resolve(activeDir, file);
      fs.readFile(fullFname, 'utf8', function(err, inc) {
        if (errState) return;
        if (err) return cb(errState = err);
        self.processIncludes(inc, activeDir, function(err, inc) {
          if (errState) return;
          if (err) return cb(errState = err);
          incCount--;
          includeData[file] = inc;
          input = input.split(include + os.EOL).join(
            includeData[file] + os.EOL);
          if (incCount === 0) {
            return cb(null, input);
          }
        });
      });
    });
  });
}


Generator.prototype.next = function(er, input, inputFile, cb) 
{
  debugger;
  var self = this;
  if (er) throw er;
  switch (this.format) {
    case 'json':
      json(input, inputFile, function(er, obj) {
        if (er) throw er;
        self.outputStream.write(JSON.stringify(obj, null, 2));
        cb();
      });
      break;

    case 'html':
      var configObj = getConfigForMarkdownFile(inputFile);
      html(input, inputFile, this.template, configObj, function(er, html) {
        if (er) throw er;
        self.outputStream.write(html);
        cb();
      });
      break;

    default:
      throw new Error('Invalid format: ' + format);
  }
}

module.exports = Generator;