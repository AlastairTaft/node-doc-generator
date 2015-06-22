var fs = require('fs');


module.exports = function findMarkdownFile(candidate, cb) {
  var hasMdEnding = /\.md$/.test(candidate),
      hasMarkdownEnding = /\.markdown$/.test(candidate);

  if (hasMdEnding || hasMarkdownEnding) {
    fs.exists(candidate, function(exists) {
      if (!exists)
        return cb(new Error('no file found for ' + candidate));

      return cb(null, candidate);
    });

    return;
  }

  fs.exists(candidate + '.md', function(mdExists) {
    fs.exists(candidate + '.markdown', function(markdownExists) {
      if (mdExists && markdownExists)
        return cb(new Error('.md and .markdown file exist for ' + candidate));

      if (mdExists) return cb(null, candidate + '.md');
      if (markdownExists) return cb(null, candidate + '.markdown');

      if (!markdownExists && !mdExists)
        return cb(new Error('no file found for ' + candidate));
    });
  });
}
