const webpack = require("webpack");

module.exports = function () {
  const isMock = ["1", "true"].includes(process.env.REACT_APP_MOCKED);
  const detectProviderPath = isMock ? "../../__mocks__/@metamask" : "@metamask";
  const vegaVesting = isMock ? "vega-web3/__mocks__" : "vega-vesting";
  const vegaClaim = isMock ? "vega-web3/__mocks__" : "vega-claim";

  return {
    webpack: {
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /(.*)DETECT_PROVIDER_PATH(\.*)/,
          function (resource) {
            resource.request = resource.request.replace(
              /DETECT_PROVIDER_PATH/,
              `${detectProviderPath}`
            );
          }
        ),
        new webpack.NormalModuleReplacementPlugin(
          /(.*)VEGA_VESTING(\.*)/,
          function (resource) {
            resource.request = resource.request.replace(
              /VEGA_VESTING/,
              `${vegaVesting}`
            );
          }
        ),
        new webpack.NormalModuleReplacementPlugin(
          /(.*)VEGA_CLAIM(\.*)/,
          function (resource) {
            resource.request = resource.request.replace(
              /VEGA_CLAIM/,
              `${vegaClaim}`
            );
          }
        ),
      ],
    },
  };
};
