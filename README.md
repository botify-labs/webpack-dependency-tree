# webpack-dependency-tree

Builds a dependency tree from webpack stats

### fromStats(stats, [opts])

Builds a dependency tree from webpack stats.

`opts` can be:

  * `opts.packageDescriptors`: List of package descriptor files to look for in package directories. Defaults to `['package.json', 'bower.json', 'component.json']`

### treeToString(tree, [opts])

Converts a dependency tree to an ASCII hierarchy representation.

`opts` can be:

  * `opts.pretty`: Add colors and styles to the output
  * `opts.fullPaths`: Display full paths instead of relative paths.
