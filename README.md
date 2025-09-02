# NestJS Bootstrap Boilerplate

NestJS Bootstrap Boilerplate is a starter project for quickly building backend applications with NestJS.  
It comes with pre-configured modules for `authentication`, `authorization`, `database integration`, `caching`, `background jobs`, `scheduling`, `real-time communication`, `security`, `logging`, and more.

---

## Goals

- Fast initialization with minimal setup.
- Pre-built integrations to reduce repetitive work.
- Ready for production with performance and security best practices.

---

## Technologies

- Configuration: `@nestjs/config`
- Authentication & Authorization: `@nestjs/jwt`, `bcrypt` (RBAC, ABAC)
- Databases:
  - `@nestjs/mongoose` – MongoDB
  - `@nestjs/typeorm` – PostgreSQL
- Caching: `@nestjs/cache-manager` (Memory, Redis)
- Queues: `@nestjs/bullmq`
- Scheduling: `@nestjs/schedule`
- Real-time: `@nestjs/platform-socket.io`, `@nestjs/websockets`, `rxjs`
- API Documentation: `@nestjs/swagger`
- Security: `helmet`, `@nestjs/throttler`, `cors`
- File: `multer`, `sharp`
- Email: `nodemailer`, `ejs`
- HTTP Client: `@nestjs/axios`
- Logging: `morgan`, `interceptor`, `telegram-bot`
- OpenAI: `openai`

---

## Diagrams

- [Authorization Flow](./src/modules/auth/documentation/authorization-flow.md)
- [Login Flow](./src/modules/auth/documentation/login-flow.md)
- [Register Flow](./src/modules/auth/documentation/register.flow.md)
- [Refresh Token Flow](./src/modules/auth/documentation/refresh-token.flow.md)
- [Forgot Password Flow](./src/modules/auth/documentation/forgot-password.flow.md)

---

## Installation

```bash
# clone project
git clone https://github.com/namnguyen2k1/nest-bootstrap-boilerplate
# create the environment file
cp .env.example .env
# install packages
yarn install
# update MONGO_URL, POSTGRES_URL, REDIS_URL in .env file
# run development
yarn start:dev
```

---
