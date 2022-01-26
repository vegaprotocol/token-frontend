import { createConfiguration, DefaultApi } from "vegawallet-service-client";

export const vegaWalletService = new DefaultApi(
  createConfiguration({
    authMethods: {
      bearer: `Bearer ${localStorage.getItem("vega_wallet_token")}`,
    },
    promiseMiddleware: [
      {
        pre: async (requestContext) => {
          const headers = requestContext.getHeaders();
          if (
            "Authorization" in headers &&
            headers.Authorization === "Bearer null"
          ) {
            console.log("first login: getting and setting auth header");
            requestContext.setHeaderParam(
              "Authorization",
              `Bearer ${localStorage.getItem("vega_wallet_token")}`
            );
          }
          return requestContext;
        },
        post: async (requestContext) => {
          return requestContext;
        },
      },
    ],
  })
);
