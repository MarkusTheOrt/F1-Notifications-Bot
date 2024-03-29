FROM node:lts-bullseye as build-stage

RUN mkdir /f1-notif
COPY package*.json /f1-notif/
WORKDIR /f1-notif/

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine

RUN mkdir /f1-notif/

COPY --from=build-stage /f1-notif/ .

CMD npm run serve