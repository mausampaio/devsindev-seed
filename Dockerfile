FROM node:lts-alpine

ENV HOME=/app
WORKDIR $HOME

COPY . /app

CMD npm start