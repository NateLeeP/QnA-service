FROM node:10

RUN mkdir /usr/src/server && cd /usr/src
COPY package*.json ./
RUN npm install

COPY ./server ./server
COPY ./db_config.js ./db_config.js

EXPOSE 3000

CMD ["node", "server/server.js"]
