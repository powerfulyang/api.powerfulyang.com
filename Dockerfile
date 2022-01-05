FROM node:lts-alpine

WORKDIR /usr/app/api.powerfulyang.com

COPY package.json .
COPY package-lock.json .
COPY addon.api/ ./addon.api/
COPY binding.gyp binding.gyp


RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    # Support for patent-encumbered HEIC images  \
    # requires the use of a globally-installed libvips  \
    # compiled with support for libheif, libde265 and x265.
    && apk add --update --no-cache  \
    --repository https://dl-3.alpinelinux.org/alpine/edge/community \
    --repository https://dl-3.alpinelinux.org/alpine/edge/main vips-dev \
    && apk add --no-cache --virtual native-deps \
         g++ gcc libgcc libstdc++ linux-headers make python3 \
    && npm ci --quiet \
    && npm cache clean --force \
    && apk del native-deps g++ gcc libgcc libstdc++ linux-headers make python3

COPY dist/ ./dist/

CMD npm run start:prod
