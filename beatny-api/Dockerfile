# Workspace
FROM node:alpine AS workspace
WORKDIR /usr/app
EXPOSE 8080

COPY package.json yarn.lock ./
RUN yarn --cache-folder .yarncache install
COPY . .

ENTRYPOINT [ "yarn", "dev" ]


# Builder
FROM node:alpine AS builder
WORKDIR /usr/app
ENV NODE_ENV production

COPY --from=workspace /usr/app ./
RUN yarn build


# Production
FROM node:alpine
WORKDIR /usr/app
ENV NODE_ENV production

COPY --from=builder /usr/app/.yarncache ./.yarncache
COPY --from=builder /usr/app/package.json /usr/app/yarn.lock ./
COPY --from=builder /usr/app/dist ./dist
RUN yarn --cache-folder .yarncache install
RUN yarn --cache-folder .yarncache cache clean

ENTRYPOINT [ "yarn", "start" ]
