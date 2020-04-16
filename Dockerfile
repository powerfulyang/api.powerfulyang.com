FROM powerfulyang/api.powerfulyang.com.base:latest

WORKDIR /usr/app

COPY dist/ ./dist/

CMD npm run start:prod
