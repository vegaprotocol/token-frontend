FROM node:14.18.1-buster as build

ARG REACT_APP_ENV
ARG REACT_APP_CHAIN
ARG REACT_APP_VEGA_URL
ARG REACT_APP_INFURA_ID
ARG COMMIT_REF
# Used only if ENV is set to CUSTOM
ARG CUSTOM_URLS
ARG CUSTOM_URLS_WITH_GRAPHQL
ARG CUSTOM_TOKEN_ADDRESS
ARG CUSTOM_CLAIM_ADDRESS
ARG CUSTOM_LOCKED_ADDRESS
ARG CUSTOM_VESTING_ADDRESS
ARG CUSTOM_STAKING_BRIDGE

WORKDIR /build

COPY package.json yarn.lock ./
RUN touch .env.example && yarn

COPY . .
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
