FROM node:lts-alpine
RUN mkdir /app
WORKDIR /app
COPY /app/package*.json ./
RUN npm ci --only=production
COPY /node .
EXPOSE 80 443
CMD [ "npm", "start" ]

