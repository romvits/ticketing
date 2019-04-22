FROM node:lts-alpine
RUN mkdir /app
WORKDIR /app
COPY /node/app/package*.json ./
RUN npm ci --only=production
COPY /node/app .
EXPOSE 80 443
CMD [ "npm", "start" ]

