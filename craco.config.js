const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function () {
  const isMock = ["1", "true"].includes(process.env.REACT_APP_MOCKED);
  const detectProviderPath = isMock ? "../../__mocks__/@metamask" : "@metamask";
  const vegaWeb3Path = isMock ? "vega-web3/__mocks__" : "vega-web3";
  const graphQlProviderPath = isMock
    ? "graphql-provider/__mocks__"
    : "graphql-provider";

  return {
    webpack: {
      plugins: [
        new MiniCssExtractPlugin({
          ignoreOrder: true,
        }),
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
        new webpack.NormalModuleReplacementPlugin(
          /(.*)GRAPHQL_PROVIDER(\.*)/,
          function (resource) {
            resource.request = resource.request.replace(
              /GRAPHQL_PROVIDER/,
              `${graphQlProviderPath}`
            );
          }
        ),
      ],
    },
  };
};
