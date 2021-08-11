const webpack = require("webpack");

module.exports = function () {
  const detectProviderPath = ["1", "true"].includes(
    process.env.REACT_APP_MOCKED
  )
    ? "../../__mocks__/@metamask"
    : "@metamask";

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
      ],
    },
  };
};
