# **NestJS Bootstrap Boilerplate**

**NestJS Bootstrap Boilerplate** is a starter project designed to help backend developers kickstart a **NestJS** application without spending time on repetitive setup.
It comes pre-configured with most of the essential building blocks for a modern backend system: **authentication/authorization**, **databases (MongoDB, PostgreSQL)**, **caching (Memory, Redis)**, **queue processing**, **cron jobs**, **real-time communication (WebSocket, SSE)**, **API documentation**, **logging**, **security**, and **image processing**.

## 🎯 **Goals**

- **Quick project initialization** with minimal setup.
- **Well-structured modules** for easy scalability and maintenance.
- **Pre-built integrations** to save time and avoid repetitive code.
- **Performance and security optimized** out of the box.

## 🛠 **Technologies & Libraries**

- **Configuration & Environment Management:** `@nestjs/config`
- **Authentication & Authorization:** `@nestjs/jwt`, `bcrypt` (RBAC, ABAC)
- **Databases:**
  - `@nestjs/mongoose` – MongoDB (model, schema, config)
  - `@nestjs/typeorm` – PostgreSQL (logging connection)

- **Caching:** `@nestjs/cache-manager` (Memory & Redis)
- **Queues:** `@nestjs/bullmq` – background jobs (e.g., sending emails)
- **Scheduling:** `@nestjs/schedule` – cron jobs
- **Real-time Communication:** `@nestjs/platform-socket.io`, `@nestjs/websockets`, `rxjs` – WebSocket & SSE
- **Static File Serving:** `@nestjs/serve-static`
- **API Documentation:** `@nestjs/swagger` – full Swagger configuration
- **Security:** `helmet`, `@nestjs/throttler`, CORS
- **Image Processing:** `multer` (disk-storage), `sharp`
- **Email Sending:** `nodemailer` (registration verification, 2FA, password reset, etc.)
- **HTTP Client:** `@nestjs/axios`
- **Logging:** `morgan` (or LoggingInterceptor)

## 📂 **Main Folder Structure**

The project is organized into clear modules, including:

- **config/** – Environment, database, cache, swagger, mail configurations
- **infrastructure/** – Infrastructure layer (database, repository, model, schema)
- **modules/** – Business logic modules (auth, user, role, notification, post, device, token, otp)
- **queue/** – Queue system (BullMQ)
- **socket/** – WebSocket gateway and services
- **shared/** – Common utilities (decorators, interceptors, middleware, utils, etc.)
- **disk-storage/** – File and image processing
- **http-client/** – Third-party API integration
- **cron/** – Scheduled tasks
- **open-ai/** – OpenAI API

## 🚀 **Key Features**

- **Complete Authentication & Authorization** with JWT, Role, and Permission support.
- **Layered architecture** (Config – Infrastructure – Modules – Shared).
- **Built-in security and logging**.
- **Multiple real-time communication options** (WebSocket, SSE).
- **Highly scalable**, ready for production-grade projects.
