FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install --global pnpm@9.0.0
COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build pnpm install --frozen-lockfile

FROM base AS backend
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*
RUN pnpm --filter backend build && mkdir -p /data/uploads /data/backups && chown -R node:node /data
ENV NODE_ENV=production
ENV UPLOAD_DIR=/data/uploads
ENV BACKUP_DIR=/data/backups
EXPOSE 3001
USER node
CMD ["pnpm", "--filter", "backend", "start"]

FROM base AS web-build
ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_INSTAGRAM_URL
ARG NEXT_PUBLIC_SPOTIFY_URL
ARG NEXT_PUBLIC_ISSN
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
ENV NEXT_PUBLIC_INSTAGRAM_URL=$NEXT_PUBLIC_INSTAGRAM_URL
ENV NEXT_PUBLIC_SPOTIFY_URL=$NEXT_PUBLIC_SPOTIFY_URL
ENV NEXT_PUBLIC_ISSN=$NEXT_PUBLIC_ISSN
RUN pnpm --filter web build

FROM web-build AS web
RUN chown -R node:node /app/apps/web/.next
ENV NODE_ENV=production
ENV API_INTERNAL_URL=http://backend:3001
EXPOSE 3000
USER node
CMD ["pnpm", "--filter", "web", "start", "--hostname", "0.0.0.0"]
