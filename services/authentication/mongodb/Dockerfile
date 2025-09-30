FROM node:22-bullseye

WORKDIR /app

COPY ./services/authentication/ /app

RUN yarn install --pure-lockfile --production=true

RUN yarn lint

RUN yarn build

EXPOSE 5010

CMD yarn start:prod
