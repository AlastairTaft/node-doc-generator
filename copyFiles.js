/**
 * @fileoverview Generate the documentation for the included packages.
 */

var path = require('path'),
  fs = require('fs'),
  spawn = require('child_process').spawn;

//var generator = require('doc-generator'),
var  walk = require(__dirname + "/lib/walk.js"),
  Promise = require('promise'),
  copyFile = require(__dirname + '/lib/copyFile.js'),
  Generator = require('./Generator.js');

walk = Promise.denodeify(walk);
copyFile = Promise.denodeify(copyFile);


module.exports = function(packages, outputDir, format, htmlTemplate){


  var docsLocation = path.resolve(outputDir);

  var tempFolder = path.resolve(__dirname, getRandomString());
  while(fs.existsSync(tempFolder))
      tempFolder = path.resolve(__dirname, getRandomString());


  // Build a map of document locations to which package they came from
  var docFilesToPackages = {};
  // Build a map of new document location from old document location.
  // The value will be an array encase we have multiple files with the same name
  // from different packages
  var docNewPathFrom = {};

  var ps = [];
  packages.forEach(function(packageName){
    
    var packageDocLocation = 
      path.dirname(require.resolve(packageName)) + "/doc";
    
    var p = walk(packageDocLocation)
    .then(function(paths){
      
      paths.forEach(function(p){
        docFilesToPackages[p] = packageName;
        var newPath = path.resolve(tempFolder, 
          p.slice(packageDocLocation.length + 1));
        docNewPathFrom[newPath] = docNewPathFrom[newPath] || [];
        docNewPathFrom[newPath].push(p); 
      });
      
      return Promise.resolve();
    })
    .catch(function(err){
      console.error(err);
    })
    ps.push(p);
  });

  return Promise.all(ps)

  // Now lets copy all our documentation into one folder
  .then(function(){
    
    
    fs.mkdir(tempFolder);

    var ps = [];
    for (var newPath in docNewPathFrom){
      var paths = docNewPathFrom[newPath];
      if (paths.length > 1){
        paths.forEach(function(p){
          var dir = path.dirname(newPath),
            ext = path.extname(p),
            basename = path.basename(p, ext),
            packageName = docFilesToPackages[p];

          var localNewPath = path.resolve(
            dir, 
            makePathSafe(basename + "#" + packageName + ext));

          ps.push(copyFile(p, localNewPath));
        });
      } else {
        ps.push(copyFile(paths[0], newPath));
      }
    }

    return Promise.all(ps);
  })
  .then(function(){
    return walk(tempFolder);
  })
  .then(function(paths){
    // Create an all.md file
    var allMdContent = "";
    paths.forEach(function(p){
      var include = p.slice(tempFolder.length + 1);
      allMdContent += "@include " + include + "\r\n";
    });
    // Assumes an all.md file doesn't exist
    var w = fs.createWriteStream(tempFolder + "/all.md");
    w.write(allMdContent);
    w.end();
    paths.push(tempFolder + "/all.md");
    return Promise.resolve(paths);
  })
  .then(function(paths){
    
    // Generate the html
    var ps = [];
    paths.forEach(function(p){

    
      var newPath = p.slice(tempFolder.length + 1);
        newPath = docsLocation + "/" + newPath;

      var dir = path.dirname(newPath),
        ext = path.extname(newPath),
        basename = path.basename(newPath, ext);

      if (!fs.existsSync(dir))
        fs.mkdir(dir);

      
      switch (format){
        case 'html':
          var promise = new Promise(function(resolve, reject){

            var htmlPath = dir + "/" + basename + ".html";
            var stream = fs.createWriteStream(htmlPath, {'encoding':'utf8'});
            var generator = new Generator(stream, 'html', htmlTemplate);
            generator.generate(p, function(err){
              stream.end();
              // Delete the temp file
              fs.unlinkSync(p);
              if (err) return reject(err);        
              resolve();
            });
          });
          break;
        case 'json':
          var promise = new Promise(function(resolve, reject){
            var jsonPath = dir + "/" + basename + ".json";
            var stream = fs.createWriteStream(jsonPath, {'encoding':'utf8'});
            var generator = new Generator(stream, 'json');
            generator.generate(p, function(err){
              stream.end();
              // Delete the temp file
              fs.unlinkSync(p);
              if (err) return reject(err);
              resolve();
            });
          });
          break;
        default:
          throw 'Format not supported';
      }
      
      ps.push(promise);
    })
    return Promise.all(ps);
  })
  .then(function(){
    fs.rmdirSync(tempFolder);
  })
  .catch(function(err){
    console.error(err);
  })

};


function getRandomString(){
  var chars = "abcdefghijklmnopqrstuvwxyz";
  var result = "";
  var limit = 8;
  while (limit > 0){
    result += chars[Math.floor(Math.random() * ((chars.length - 1) - 0))];
    limit--;
  }
  return result;
};

// Removes or replaces characters that arn't allowed in a directory
function makePathSafe(dir){
  // \/:*?"<>|
  // index#@alastair/pbx-api.html
  return dir.replace(/[\/\\:*?"<>]/gi, '_');
};




