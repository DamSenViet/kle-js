'use strict';
const path = require('path');

// parent folder of paths.js, not exported
const parent = path.resolve(__dirname);

// path to directories
const pathToRoot = path.resolve(parent, '..');
const pathToConfig = path.resolve(pathToRoot, 'config');
const pathToUtils = path.resolve(pathToRoot, 'utils');
const pathToPackage = path.resolve(pathToRoot, 'package');
const pathToBuild = path.resolve(pathToRoot, 'dist');
const pathToBuildCJS = path.resolve(pathToBuild, 'cjs');
const pathToBuildESM = path.resolve(pathToBuild, 'es6');
const pathToBuildUMD = path.resolve(pathToBuild, 'umd');
const pathToStats = path.resolve(pathToRoot, 'stats');
const pathToNodeModules = path.resolve(pathToRoot, 'node_modules');

// paths to specific files
const pathToBabelConfig = path.resolve(pathToConfig, 'babel.config.js');
const pathToWebpackConfig = path.resolve(pathToConfig, 'webpack.config.js');
const pathToPackageIndex = path.resolve(pathToPackage, 'index.ts')
const pathToPathsJs = path.resolve(pathToUtils, 'paths.js');
const pathToBundleStats = path.resolve(pathToStats, 'bundle.html');

// paths to tests
const pathToTests = path.resolve(pathToRoot, 'tests');
const pathToTestsSystem = path.resolve(pathToTests, 'system');

module.exports = {
  pathToRoot,
  pathToConfig,
  pathToUtils,
  pathToPackage,
  pathToBuild,
  pathToBuildCJS,
  pathToBuildESM,
  pathToBuildUMD,
  pathToStats,
  pathToNodeModules,

  pathToBabelConfig,
  pathToWebpackConfig,
  pathToPackageIndex,
  pathToPathsJs,
  pathToBundleStats,
  
  pathToTests,
  pathToTestsSystem,
};