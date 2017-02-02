/**
 * @author: @AngularClass
 */
var path = require('path');

// Helper functions
var ROOT = path.resolve(__dirname, '../..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

// args is a single argument, an array of strings
function _root(args) {
  return path.join.apply(path, [ROOT].concat(args));
}

function projectRoot(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return _root(args);
}

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.projectRoot = projectRoot;
