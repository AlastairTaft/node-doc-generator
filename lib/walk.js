/**
 * @fileoverview A function to recursivly get all the filepaths in a directory.
 */

var fs = require('fs');

/**
 * Find files recursively in dir.
 * Taken from 
 * http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 */
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = walk;