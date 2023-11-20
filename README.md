Thanks to JetBrains for providing me with a free license of their awesome IDE, [WebStorm](https://www.jetbrains.com/webstorm/) [DataGrip](https://www.jetbrains.com/datagrip/).

## Features

- [Auto download your favorites from `pinterest`,`instagram`, `pixiv`](./src/schedule)
- [Repost channel message from telegram](./src/libs/telegram-bot)
- [Download YouTube video online and OCR interface](./src/tools)
  - You can have a try in https://powerfulyang.com/tools/video-downloader

## Prerequisites

- [NodeJS](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/products/docker-desktop)

## Quick Start

use docker-compose to start dependencies.

```bash
docker-compose up -d
```

### Install dependencies

- With npm

```bash
npm install
```

- With pnpm

```bash
pnpm install
```

### Start development server

- With npm

```bash
cp .env.example .env.qa
npm run qa:dev
```

- With pnpm

```bash
cp .env.example .env.qa
pnpm run qa:dev
```

If you have your own database, you can modify the `PG_HOST` in `.env.qa` file.  
Open http://localhost:3001 in your browser, and you will see the website.

## Acknowledgments

- [x] [NestJS](https://nestjs.com/)
- [x] [TypeORM](https://typeorm.io/#/)
- [x] [PostgresSQL](https://www.postgresql.org/)
- [x] [Redis](https://redis.io/)
- [x] [Docker](https://www.docker.com/)
- [x] [Docker Compose](https://docs.docker.com/compose/)
- [x] [Elasticsearch](https://www.elastic.co/)
- [x] [RabbitMQ](https://www.rabbitmq.com/)
- [x] [GitHub Actions](https://github.com/features/actions)
- [x] [Fastify](https://www.fastify.io/)
- [x] [Swagger](https://swagger.io/)
- [x] [TypeScript](https://www.typescriptlang.org/)
- [x] [pnpm](https://pnpm.io/)
- [x] [Jest](https://jestjs.io/)
- [x] [ESLint](https://eslint.org/)
- [x] [Prettier](https://prettier.io/)
- [x] [Husky](https://typicode.github.io/husky/#/)

## License

[MIT](./LICENSE)

If you have any questions, please feel free to contact me via [email](mailto:i@powerfulyang.com).
