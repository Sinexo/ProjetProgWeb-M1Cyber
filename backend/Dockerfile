FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set strict-ssl false
RUN npm install

COPY .env ./
COPY . .

EXPOSE 4000

CMD ["npm", "start"] 