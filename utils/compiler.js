'use strict';
const signale = require('signale');
const clear = require('clear');
const webpack = require('webpack');
const webpackFormatMessages = require('webpack-format-messages');
const {
  webpackConfigUMD,
  webpackConfigMinUMD,
} = require('../config/webpack.config');

const webpackConfigs = [
  webpackConfigUMD,
  webpackConfigMinUMD,
];

const compiler = webpack(webpackConfigs);
signale.config({ displayTimestamp: true });

// limited hooks due to multi-compiler
compiler.hooks.watchRun.tap('watching', () => {
  clear();
  signale.await('Compiling...');
});

compiler.hooks.done.tap('done', (stats) => {
  const messages = webpackFormatMessages(stats);

  if (!messages.errors.length && !messages.warnings.length) {
    signale.success('Application compiled!');
  }

  if (messages.errors.length) {
    signale.fatal('Application failed to compile.');
    messages.errors.forEach(e => console.log(e));
    return;
  }

  if (messages.warnings.length) {
    signale.warn('Application compiled with warnings.');
    messages.warnings.forEach(w => console.log(w));
  }
});


module.exports = compiler;