FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache ttf-dejavu fontconfig

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
