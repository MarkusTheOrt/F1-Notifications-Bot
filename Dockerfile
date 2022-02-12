FROM node:lts-bullseye

RUN mkdir /f1-notif
COPY package*.json /f1-notif/
WORKDIR /f1-notif/

RUN npm install

COPY . .

RUN npm install -g typescript

RUN tsc

CMD node dist/index.js