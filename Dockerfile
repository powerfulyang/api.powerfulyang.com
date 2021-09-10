FROM node:lts-alpine3.14

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .


# 设置时区为上海
RUN apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

RUN npm ci --production --quiet \
    && npm cache clean --force

COPY dist/ ./dist/

CMD npm run start:prod
