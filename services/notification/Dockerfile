FROM node:22-bullseye

WORKDIR /app

COPY ./services/notification/ /app

RUN yarn install --pure-lockfile --production=true

RUN yarn lint

RUN yarn build

EXPOSE 5020

CMD yarn start:prod
