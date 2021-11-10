'use strict';
const compiler = require('../utils/compiler');
const { pathToNodeModules } = require('../utils/paths');

compiler.watch({
  aggregateTimeout: 300,
  poll: undefined,
  ignored: pathToNodeModules,
}, (error, stats) => {
  if (error) {
    console.log(error);
    throw error;
  }
});