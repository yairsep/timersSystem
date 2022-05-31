FROM node:16

WORKDIR /app

COPY package.json package.json

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

RUN #npm install -D nodemon

CMD [ "node", "index.js"]