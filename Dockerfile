FROM powerfulyang/api.powerfulyang.com-base

COPY . .

RUN pnpm run bootstrap \
    && pnpm run build

CMD npm run start:prod
