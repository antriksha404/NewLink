FROM node:22-bullseye

WORKDIR /app

COPY ./services/blockchain/ /app

RUN yarn install --pure-lockfile --production=true

RUN yarn lint

RUN yarn build

EXPOSE 4030

CMD yarn start:prod
