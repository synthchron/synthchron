FROM node:16

WORKDIR /app

COPY package.json ./

RUN yarn

COPY server.js ./

EXPOSE 4444

ENV HOST=0.0.0.0

CMD [ "node", "server.js" ]