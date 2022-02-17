FROM node:lts-bullseye as build-stage

RUN mkdir /f1-notif
COPY package*.json /f1-notif/
WORKDIR /f1-notif/

RUN npm install

COPY . .

RUN npm install -g typescript

RUN tsc

FROM node:lts-alpine

RUN mkdir /f1-notif/

COPY --from=build-stage /f1-notif/dist/ .

CMD node index.js