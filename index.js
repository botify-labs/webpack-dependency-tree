var path = require('path');

var archy = require('archy');
var chalk = require('chalk');
var resolve = require('enhanced-resolve');

exports.fromStats = function buildTree(stats, opts) {
  opts = opts || {};
  opts.packageDescriptors = opts.packageDescriptors || ['package.json', 'bower.json', 'component.json'];

  // Build a module dependency tree
  var tree = {};
  stats.modules.forEach(function(mod) {
    // Ignore origin modules
    if (mod.name.indexOf('~') === -1) {
      return;
    }

    // Resolve webpack query string and loaders to retrieve the resource path.
    // webpack dependencies are prepended with (webpack)
    // Module directories are represented by a ~
    var modulePath = resolve.parse(mod.name).resource.path.replace('(webpack)', './~/webpack');
    var moduleFullPath = resolve.parse(mod.identifier).resource.path;

    // The following code maps every `~/module_name` in `modulePath` to its corresponding
    // `module_folder/module_name` in `moduleFullPath`

    // Split at each `~/module_name` and escape for use in a regexp
    var splitParts = modulePath.split(/~\/[^\/]+\//).map(escapeRegExp);

    // Find and traverse every `module_folder/module_name` construct in `moduleFullPath`
    var parentTree = tree;
    for (var i = 1; i < splitParts.length; i++) {
      // Remove everything before the module occurrence so that match.index points
      // to the beginning of the module_folder/module_name construct
      var regexpParts = splitParts.slice(i);
      var regexpHead = '([^\/]+\/([^\/]+)\/)'; // match `module_folder/module_name`
      var regexpTail = regexpParts.join('[^\/]+\/[^\/]+\/'); // match the rest of the path
      var regexp = new RegExp(regexpHead + regexpTail + '$');

      var match = moduleFullPath.match(regexp);
      if (!match) {
        // Shouldn't happen
        return;
      }

      var packagePath = moduleFullPath.slice(0, match.index + match[1].length);

      // Retrieve the child module version from its descriptor file (package.json, bower.json, ...)
      var packageVersion = 'unknown';
      for (var j = 0; j < packageDescriptors.length; j++) {
        try {
          packageVersion = require(packagePath + packageDescriptors[j]).version;
          break;
        } catch (e) {
          // do nothing
        }
      }

      var packageName = match[2];
      var package = parentTree[packageName];
      if (!package) {
        parentTree[packageName] = package = {
          name: packageName,
          version: packageVersion,
          path: packagePath,
          tree: {}
        };
      }
      parentTree = package.tree;
    }
  });

  return tree;
};

exports.treeToString = function treeToString(tree, opts) {
  opts = opts || {};
  opts.pretty = opts.pretty || false;
  opts.fullPaths = opts.fullPaths || false;

  // Node that will eventually be passed to archy
  var topNode = {
    label: '',
    nodes: []
  };

  // Recursively build an archy node tree from our package tree
  (function recursiveTreeBuild(tree, node) {
    for (var key in tree) {
      var package = tree[key];
      var packageName = opts.pretty ? chalk.underline(package.name) : package.name;
      var packagePath = opts.fullPaths ? package.path : path.relative(path.dirname(module.parent.filename), package.path);
      packagePath = opts.pretty ? chalk.grey(packagePath) : packagePath;

      var childNode = {
        label: packageName + '@' + package.version + '\n' + packagePath,
        nodes: []
      };
      recursiveTreeBuild(package.tree, childNode);
      node.nodes.push(childNode);
    };
  })(tree, topNode);

  return archy(topNode);
};
