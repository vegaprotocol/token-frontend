const fs = require("fs-extra");
const path = require("path");
const deepmerge = require("deepmerge");

const cypressConfigResolverByFile = (filename) => {
  const pathToConfigFile = path.resolve(__dirname, `${filename}.json`);
  return fs.readJsonSync(pathToConfigFile);
};

const cypressConfigResolver = (config) => {
  let configJson = require(config.configFile);
  if (configJson.extends) {
    const baseConfigFilename = path.join(
      config.projectRoot,
      configJson.extends
    );
    const baseConfig = require(baseConfigFilename);
    console.log("merging %s with %s", baseConfigFilename, config.configFile);
    configJson = deepmerge(baseConfig, configJson);
  }

  return configJson;
};

module.exports.cypressConfigResolver = cypressConfigResolver;
