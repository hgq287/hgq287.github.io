---
slug: "docker-blueprint-architecture-command-lab"
title: "Docker Blueprint: Architecture & Command Lab"
date: "2026-03-10"
excerpt: "A practical guide to Docker architecture, core commands, networking, and Compose—with a VM vs container diagram and an architect's checklist."
tags:
  - Docker
  - DevOps
  - Architecture
---

## 1. Conceptual Diagram: Docker vs. Virtual Machine

To see why Docker is fast, look at the kernel layer. A VM runs a full guest OS and hypervisor; a container shares the host kernel.

```plaintext
      [ VIRTUAL MACHINE ]                    [ DOCKER CONTAINER ]
+----------------------------+          +----------------------------+
|      App / Business        |          |      App / Business        |
+----------------------------+          +----------------------------+
|   Bins / Libs (Guest OS)   |          |    Bins / Libs (Isolated)  |
+----------------------------+          +----------------------------+
|      Guest OS Kernel       |          |      Docker Engine         |
+----------------------------+          +----------------------------+
|      Hypervisor            |          |      Host OS Kernel        |
+----------------------------+          +----------------------------+
|      Infrastructure        |          |      Infrastructure        |
+----------------------------+          +----------------------------+
(Resource-heavy: full guest OS)          (Shared kernel — much lighter)
```

## 2. Core Commands Lab (Quick Reference)

### A. Image Management (The Mold)

**Build an image:**

```bash
docker build -t <name>:<tag> .
```

**Remove dangling images** (failed builds, free disk space):

```bash
docker image prune
```

**Inspect layers** (see what makes an image heavy):

```bash
docker history <image_id>
```

### B. Container Lifecycle (Running the App)

**Run app and map port:**

```bash
docker run -d -p 8080:3000 --name my-app <image>
```

- `-d`: Run in the background (detached).
- `-p 8080:3000`: Host port 8080 → container port 3000.

**Stream logs** (essential for debugging):

```bash
docker logs -f <container_name>
```

**Shell into a running container:**

```bash
docker exec -it <container_name> /bin/sh
```

### C. Cleanup (System Tidy)

**Full cleanup** (containers, images, networks, volumes not in use):

```bash
docker system prune -a --volumes
```

Use when disk is full. This removes everything unused.

## 3. Networking Blueprint (Connecting Services)

In a stack like NestJS + Kafka + PostgreSQL, containers need to talk to each other.

**Create a custom network:**

```bash
docker network create my-system-net
```

**Attach services:** When you run a container, add `--network my-system-net`.

**Internal DNS:** Containers can reach each other by **name** (e.g. NestJS connects to Postgres at `postgres:5432` instead of an IP).

## 4. Docker Compose: The Orchestrator

Use a single `docker-compose.yml` to define and run the whole stack instead of many manual commands.

```yaml
version: '3.8'
services:
  api-gateway:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - db
    networks:
      - backend-net

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:
      - backend-net

networks:
  backend-net:
    driver: bridge

volumes:
  db-data:
```

## 5. Architect's Checklist (Things to Revisit)

**Persistence:** Always use **volumes** for databases. If the container is removed, data remains.

**Security:**

- Never put secrets in the Dockerfile. Use `.env` and `environment` in Compose.
- Prefer Alpine-based images to reduce attack surface.

**Optimization:**

- **Layer order in Dockerfile:** Put commands that change less often (e.g. `npm install`) higher so the build cache is reused.
- Use **`.dockerignore`** to exclude `node_modules`, `.git`, etc. from the build context. Builds can be much faster.
