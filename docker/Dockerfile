FROM node:14.18.1-buster as build

ARG COMMIT_REF
ARG ENV
ARG CHAIN
ARG VEGA_URL
ARG INFURA_ID

# Used only if ENV is set to VALIDATORNET
ARG VALIDATORNET_URLS
ARG VALIDATORNET_URLS_WITH_GRAPHQL
ARG NETWORK_TOKEN_ADDRESS
ARG NETWORK_CLAIM_ADDRESS
ARG NETWORK_LOCKED_ADDRESS
ARG NETWORK_VESTING_ADDRESS
ARG NETWORK_STAKING_BRIDGE

ENV COMMIT_REF=$COMMIT_REF
ENV REACT_APP_ENV=$ENV
ENV REACT_APP_CHAIN=$CHAIN
ENV REACT_APP_VEGA_URL=$VEGA_URL
ENV REACT_APP_INFURA_ID=$INFURA_ID

ENV VALIDATORNET_URLS=$VALIDATORNET_URLS
ENV VALIDATORNET_URLS_WITH_GRAPHQL=$VALIDATORNET_URLS_WITH_GRAPHQL
ENV NETWORK_TOKEN_ADDRESS=$NETWORK_TOKEN_ADDRESS
ENV NETWORK_CLAIM_ADDRESS=$NETWORK_CLAIM_ADDRESS
ENV NETWORK_LOCKED_ADDRESS=$NETWORK_LOCKED_ADDRESS
ENV NETWORK_VESTING_ADDRESS=$NETWORK_VESTING_ADDRESS
ENV NETWORK_STAKING_BRIDGE=$NETWORK_STAKING_BRIDGE

WORKDIR /build

COPY . .
RUN yarn
RUN yarn build

FROM nginx:latest

COPY --from=build /build/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/build /usr/share/nginx/html
COPY --from=build /build/docker/50x.html /usr/share/nginx/html/50x.html

# Issue as rootless https://bugs.launchpad.net/ubuntu/+source/nginx/+bug/1581864
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx \
                        /var/cache/nginx \
                        /var/run/nginx.pid \
                        /usr/share/nginx \
                        /etc/nginx/conf.d

USER nginx

EXPOSE 8080
