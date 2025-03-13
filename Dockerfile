ARG VERSION="local"
ARG NODE_ENV="production"

FROM node:22.14.0 as builder

ARG VERSION
ARG NODE_ENV

ENV VERSION=$VERSION
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY . /app

EXPOSE 80

RUN ["npm", "i"]
RUN ["npm", "run", "build"]

FROM node:22.14.0

ARG VERSION
ARG NODE_ENV

ENV VERSION=$VERSION
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json /app/.npmrc /app/nest-cli.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN ls
RUN ["npm", "ci", "--only=prod"]
RUN ["npx", "prisma", "generate"]
ENTRYPOINT ["node", "dist/main"]