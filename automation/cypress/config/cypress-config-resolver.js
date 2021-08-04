const fs = require("fs-extra");
const path = require("path");

const cypressConfigResolverByFile = (filename) => {
  const pathToConfigFile = path.resolve(__dirname, `${filename}.json`);
  return fs.readJsonSync(pathToConfigFile);
};

const cypressConfigResolver = (config) => {
  const fileConfig = cypressConfigResolverByFile(
    process.env.CYPRESS_ENV || "localhost"
  );
  const mergedConfig = {
    ...fileConfig,
    ...config,
  };
  return mergedConfig;
};

module.exports.cypressConfigResolver = cypressConfigResolver;
