#!/usr/bin/env node

var args = process.argv.slice(2);

var generate = require('./copyFiles.js');

var packages = [],
  outputDir,
  template,
  format = 'html';

args.forEach(function (arg) {
  if (arg.match(/^\-\-outputDir=/)) {
    outputDir = arg.replace(/^\-\-outputDir=/, '');
  } else if (arg.match(/^\-\-template=/)) {
    template = arg.replace(/^\-\-template=/, '');
  } else if (arg.match(/^\-\-format=/)) {
    format = arg.replace(/^\-\-format=/, '');
  } else {
    packages.push(arg);
  }
});

if (typeof outputDir === 'undefined')
  throw "outputDir not provided"

if (typeof template === 'undefined' && format == 'html')
  throw "template not provided"

generate(packages, outputDir, format, template);
