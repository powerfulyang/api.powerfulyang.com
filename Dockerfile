FROM powerfulyang/api.powerfulyang.com-base

COPY . .

RUN pnpm run bootstrap \
    && pnpm run build \
    && pnpm store prune

CMD pnpm run start:prod
