'use strict';
const compiler = require('../utils/compiler');

compiler.run((error, stats) => {
  if (error) {
    console.log(error);
    throw error;
  }
});