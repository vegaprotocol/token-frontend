// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const { cypressConfigResolver } = require('../config/cypress-config-resolver');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = (on, config) => {
  on('file:preprocessor', cucumber());
  return cypressConfigResolver();
};
