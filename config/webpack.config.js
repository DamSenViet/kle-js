'use strict';
const TerserPlugin = require('terser-webpack-plugin');
const {
  pathToBuildCJS,
  pathToBuildUMD,
  pathToNodeModules,
  pathToPackageIndex,
} = require('../utils/paths');
const {
  babelDevConfig,
  babelProdConfig
} = require('./babel.config');


const entry = pathToPackageIndex;

const output = { filename : 'index.js' };

// for node environments
const outputCJS = {
  ...output,
  libraryTarget: 'commonjs',
  path: pathToBuildCJS,
};

// for browser environments
const outputUMD = {
  ...output,
  // global name in browser
  library: 'kle',
  libraryTarget: 'umd',
  path: pathToBuildUMD,
  umdNamedDefine: true,
  globalObject: `(typeof self !== 'undefined' ? self : this)`,
};

const outputMinUMD = {
  ...outputUMD,
  filename: 'index.min.js',
};

const babelLoaderDev = {
  loader: 'babel-loader',
  options: babelDevConfig
};


const babelLoaderProd = {
  ...babelLoaderDev,
  options: babelProdConfig
};


const jsRuleDev = {
  test: /\.tsx?$/i,
  use: [
    babelLoaderDev,
    'ts-loader',
  ],
  exclude: pathToNodeModules,
};


const jsRuleProd = {
  ...jsRuleDev,
  use: [
    babelLoaderProd,
    'ts-loader',
  ],
};


const rulesDev = [
  jsRuleDev,
];


const rulesProd = [
  jsRuleProd,
];


const resolve = {
  extensions: ['.ts', '.js'],
};


const optimizationProd = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      parallel: true,
      terserOptions: {
        mangle: true,
        ie8: false,
      },
      extractComments: false,
    }),
  ]
};

const webpackDevConfigCJS = {
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  entry,
  output: outputCJS,
  module: {
    rules: rulesDev
  },
  resolve,
  performance: false,
};

const webpackProdConfigCJS = {
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  entry,
  output: outputCJS,
  module: {
    rules: rulesProd
  },
  resolve,
  performance: false,
};

const webpackConfigUMD = {
  ...webpackDevConfigCJS,
  target: 'web',
  output: outputUMD,
};

const webpackConfigMinUMD = {
  ...webpackProdConfigCJS,
  target: 'web',
  output: outputMinUMD,
  optimization: optimizationProd,
};

module.exports = {
  webpackDevConfigCJS,
  webpackProdConfigCJS,
  webpackConfigUMD,
  webpackConfigMinUMD,
};