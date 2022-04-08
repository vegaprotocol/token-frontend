const commands = require("./commands.js");
const allure = require("allure-commandline");

exports.config = {
  specs: ["./features/**/*.feature"],
  // Patterns to exclude.
  exclude: [],
  maxInstances: 1,

  // https://webdriver.io/docs/options/#capabilities
  // BSTACK OPTIONS : https://www.browserstack.com/automate/capabilities?tag=selenium-4#
  capabilities: [
    {
      browserName: "Chrome",
      browserVersion: "96.0",
      "bstack:options": {
        os: "OS X",
        osVersion: "Big Sur",
        seleniumVersion: "3.14.0",
        local: "true",
      },
      "goog:chromeOptions": {
        args: ["disable-popup-blocking", "allow-insecure-localhost"],
        extensions: [
          require("fs")
            .readFileSync("metamask_10_8_1_0.crx")
            .toString("base64"),
        ],
      },
    },
  ],
  //   logLevel: 'warn',

  user: process.env.BROWSERSTACK_USER,
  key: process.env.BROWSERSTACK_KEY,
  services: [
    [
      "browserstack",
      {
        browserstackLocal: true,
      },
    ],
  ],
  logLevel: "info",

  bail: 0,
  baseUrl: "http://localhost:3000",
  // Default timeout for all waitFor* commands.
  waitforTimeout: 30000,
  // Default timeout in milliseconds for requests
  connectionRetryTimeout: 150000,
  // Default request retries count
  connectionRetryCount: 3,
  framework: "cucumber",
  reporters: [
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true,
      },
    ],
  ],
  cucumberOpts: {
    // <string[]> (file/dir) require files before executing features
    require: ["./features/step-definitions/*.steps.js"],
    // <boolean> show full backtrace for errors
    backtrace: false,
    // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    requireModule: [],
    // <boolean> invoke formatters without executing steps
    dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <boolean> fail if there are any undefined or pending steps
    strict: false,
    // <string> (expression) only execute the features or scenarios with tags matching the expression
    tagExpression: "not @todo and not @manual and not @ignore",
    // <number> timeout for step definitions
    timeout: 60000,
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: false,
  },

  before: function () {
    // Add commands to WebdriverIO
    /* eslint-disable no-unused-expressions */
    Object.keys(commands).forEach((key) => {
      console.log("Adding custom command - ", key);
      browser.addCommand(key, commands[key]);
    }),
      browser.switchWindow("Vega");
  },

  afterStep: function () {
    // if (!result.passed){
    browser.takeScreenshot();
    // }
  },

  onComplete: function () {
    const reportError = new Error("Could not generate Allure report");
    const generation = allure(["generate", "allure-results", "--clean"]);
    return new Promise((resolve, reject) => {
      const generationTimeout = setTimeout(() => reject(reportError), 300000);

      generation.on("exit", function (exitCode) {
        clearTimeout(generationTimeout);

        if (exitCode !== 0) {
          return reject(reportError);
        }
        resolve();
      });
    });
  },
};
