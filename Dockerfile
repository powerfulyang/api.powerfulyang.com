# 第一阶段：安装依赖
FROM node:lts-alpine AS dependencies

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml .npmrc binding.gyp ./
COPY addon ./addon
COPY patches ./patches

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.18/main" > /etc/apk/repositories \
    && echo "https://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories \
    && apk update && apk upgrade \
    && apk add --no-cache tzdata \
    && echo "Asia/Shanghai" > /etc/timezone \
    # node-gyp
    && apk add --no-cache --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make graphicsmagick \
    # Support for patent-encumbered HEIC images  \
    # requires the use of a globally-installed libvips  \
    # compiled with support for libheif, libde265 and x265.
    # sharp Changelog: https://sharp.pixelplumbing.com/changelog
    && apk add --no-cache vips-cpp \
#    && npm ci --quiet \
#    && npm run build \
#    && npm prune --omit=dev \
#    && npm cache clean --force \
    && npm i -g pnpm \
    && pnpm install --frozen-lockfile

# 第二阶段
FROM node:lts-alpine AS builder

ENV BUILD=true

WORKDIR /usr/app

COPY . .

# 从这里开始就 miss cache
COPY --from=dependencies /usr/app/node_modules ./node_modules

RUN npm i -g pnpm \
    && pnpm run build \
    && pnpm prune --prod --config.ignore-scripts=true

# 第三阶段
FROM node:lts-alpine AS runner

WORKDIR /usr/app
RUN chown -R node:node /usr/app

COPY --from=dependencies /etc/apk/repositories /etc/apk/repositories
COPY --from=dependencies /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=dependencies /etc/timezone /etc/timezone

# yt-dlp
# 在 Alpine Linux 中，`pip` 不是默认与 `python3` 一起安装的。要在 Alpine Linux 上安装 `pip`，您需要安装 `py3-pip` 包。
RUN apk add --no-cache ffmpeg python3 py3-pip vips-dev \
    && pip install --no-cache-dir yt-dlp

USER node

COPY --chown=node:node --from=dependencies /usr/app/build ./build

COPY --chown=node:node --from=builder /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/app/dist ./dist
COPY --chown=node:node --from=builder /usr/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/app/*.traineddata ./

CMD ["npm", "run", "start"]
