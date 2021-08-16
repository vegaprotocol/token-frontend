const webpack = require("webpack");

module.exports = function () {
  const isMock = ["1", "true"].includes(process.env.REACT_APP_MOCKED);
  const detectProviderPath = isMock ? "../../__mocks__/@metamask" : "@metamask";
  const vegaWeb3Path = isMock ? "vega-web3/__mocks__" : "vega-web3";

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
          /(.*)VEGA_WEB3(\.*)/,
          function (resource) {
            resource.request = resource.request.replace(
              /VEGA_WEB3/,
              `${vegaWeb3Path}`
            );
          }
        ),
      ],
    },
  };
};
