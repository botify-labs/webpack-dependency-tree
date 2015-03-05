# webpack-dependency-tree

Builds a dependency tree from webpack stats

## Example

```
├── react@0.12.2
│   node_modules/react
├── classnames@1.1.4
│   node_modules/classnames
├── immutable@3.6.2
│   node_modules/immutable
├── lodash@2.4.1
│   node_modules/lodash
├── font-awesome@4.1.0
│   node_modules/font-awesome
├── datatables@1.10.5
│   node_modules/datatables
├── style-loader@0.8.3
│   node_modules/style-loader
├── css-loader@0.9.1
│   node_modules/css-loader
├─┬ webpack@1.7.2
│ │ node_modules/webpack
│ └─┬ node-libs-browser@0.4.3
│   │ node_modules/webpack/node_modules/node-libs-browser
│   └── process@0.10.1
│       node_modules/webpack/node_modules/node-libs-browser/node_modules/process
├── react-bootstrap@0.15.1
│   node_modules/react-bootstrap
└── jquery@1.11.2
    node_modules/jquery
```

## API

### fromStats(stats, [opts])

Builds a dependency tree from webpack stats.

`opts` can be:

  * `opts.packageDescriptors`: List of package descriptor files to look for in package directories. Defaults to `['package.json', 'bower.json', 'component.json']`

### treeToString(tree, [opts])

Converts a dependency tree to an ASCII hierarchy representation.

`opts` can be:

  * `opts.pretty`: Add colors and styles to the output
  * `opts.fullPaths`: Display full paths instead of relative paths.
