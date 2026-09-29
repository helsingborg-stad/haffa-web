FROM node:24 as compiler
WORKDIR /work
COPY . ./
RUN npm ci && npm run build

FROM node:24 as optimizer
WORKDIR /work
COPY . ./
RUN npm ci --omit=dev --omit=optional --ignore-scripts

FROM node:24-bookworm-slim
EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /usr/src/app
COPY --from=optimizer /work/public ./public
COPY --from=optimizer /work/node_modules ./node_modules
COPY --from=optimizer /work/package.json ./
COPY --from=compiler /work/build ./build
COPY --from=compiler /work/webserver/build ./webserver

USER node

CMD ["webserver/index.js"]
