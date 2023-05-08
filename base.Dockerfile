FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml .npmrc binding.gyp ./
COPY addon-api ./addon-api

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.18/main" > /etc/apk/repositories \
    && echo "https://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories \
    && apk update && apk upgrade \
    && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    # node-gyp
    && apk add --no-cache --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make \
    # Support for patent-encumbered HEIC images  \
    # requires the use of a globally-installed libvips  \
    # compiled with support for libheif, libde265 and x265.
    # sharp Changelog: https://sharp.pixelplumbing.com/changelog
    && apk add --no-cache vips-dev \
    # yt-dlp 在 Alpine Linux 中，`pip` 不是默认与 `python3` 一起安装的。要在 Alpine Linux 上安装 `pip`，您需要安装 `py3-pip` 包。
    && apk add --no-cache ffmpeg python3 py3-pip \
    && pip install --no-cache-dir yt-dlp \
#    && npm ci --quiet \
#    && npm run build \
#    && npm prune --omit=dev \
#    && npm cache clean --force \
    && npm i -g pnpm \
    && pnpm run bootstrap \
    && pnpm store prune
