# syntax=docker/dockerfile:1

FROM node:24-bookworm AS builder

WORKDIR /work

# Copy dependency manifests first to improve Docker layer caching.
COPY package.json package-lock.json .npmrc ./

RUN pnpm ci

# Copy application source after installing dependencies.
COPY . ./

RUN pnpm run build

FROM node:24-bookworm AS production-dependencies

WORKDIR /work

# Install only dependencies required at runtime.
COPY package.json package-lock.json .npmrc ./

RUN pnpm ci --omit=dev --omit=optional --ignore-scripts \
    && pnpm cache clean --force


FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=4000

WORKDIR /usr/src/app

# Copy only the files required to run the application.
COPY --from=production-dependencies --chown=node:node /work/node_modules ./node_modules
COPY --from=production-dependencies --chown=node:node /work/package.json ./package.json
COPY --from=builder --chown=node:node /work/public ./public
COPY --from=builder --chown=node:node /work/build ./build
COPY --from=builder --chown=node:node /work/webserver/build ./webserver

USER node

EXPOSE 4000

CMD ["node", "webserver/index.js"]
