FROM node:22 as compiler
ARG GITHUB_ACCESS_TOKEN
WORKDIR /work
COPY . ./
COPY deploy.npmrc .npmrc
RUN rm -f package-lock.json && npm install && npm run build

FROM node:22-alpine	as optimizer
ARG GITHUB_ACCESS_TOKEN
WORKDIR /work
COPY . ./
COPY deploy.npmrc .npmrc
RUN npm install --omit=dev --omit=optional

FROM node:22-alpine
EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /usr/src/app
COPY --from=optimizer /work/public ./public
COPY --from=optimizer /work/node_modules ./node_modules
COPY --from=optimizer /work/package.json ./
COPY --from=compiler /work/build ./build
COPY --from=compiler /work/webserver/build ./webserver

CMD ["webserver/index.js"]
