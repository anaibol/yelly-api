
## Description

Yelly API powered by Nestjs
## Installation

```bash
$ yarn
$ yarn prisma generate
```
## Local development with database in Docker

### Launching the app with a new database

```bash
$ yarn dev:docker:up:reset
$ yarn prisma migrate deploy
```
### Launching the app with existing docker database

```bash
$ yarn dev:docker:up
$ yarn dev
```

Docker database URL
```bash
postgresql://admin:admin@localhost:5432/yelly?schema=public
```
