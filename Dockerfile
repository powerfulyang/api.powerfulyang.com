FROM node:lts-alpine

WORKDIR /usr/app

COPY . .


RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    # Support for patent-encumbered HEIC images  \
    # requires the use of a globally-installed libvips  \
    # compiled with support for libheif, libde265 and x265.
    && apk add --no-cache  \
    # sharp Changelog: v0.30 - dresser -> Requires libvips v8.12.2 which is in Alpine 3.15
    --repository https://dl-3.alpinelinux.org/alpine/v3.15/community \
    vips-dev \
    && apk add --no-cache --virtual native-deps \
         g++ gcc libgcc libstdc++ linux-headers make python3 \
#    && npm ci --quiet \
#    && npm run build \
#    && npm prune --omit=dev \
#    && npm cache clean --force \
    && npm i -g pnpm \
    && pnpm run bootstrap \
    && pnpm run build \
    && apk del native-deps g++ gcc libgcc libstdc++ linux-headers make python3

CMD npm run start:prod
