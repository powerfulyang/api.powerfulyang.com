FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml .npmrc binding.gyp ./
COPY addon-api ./addon-api

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    && apk add --no-cache --virtual native-deps \
         g++ gcc libgcc libstdc++ linux-headers make python3 \
    # Support for patent-encumbered HEIC images  \
    # requires the use of a globally-installed libvips  \
    # compiled with support for libheif, libde265 and x265.
    && apk add --no-cache  \
    # sharp Changelog: v0.31.2 -> Requires libvips v8.13.3 which is in Alpine v3.17 \
         --repository https://dl-3.alpinelinux.org/alpine/v3.17/community \
         vips-dev \
#    && npm ci --quiet \
#    && npm run build \
#    && npm prune --omit=dev \
#    && npm cache clean --force \
    && npm i -g pnpm \
    && pnpm run bootstrap
