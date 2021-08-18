FROM node:lts-alpine3.13

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]