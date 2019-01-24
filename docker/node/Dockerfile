FROM node:lts-alpine
RUN mkdir -p /etc/ssl
RUN apk add openssl
RUN openssl genrsa -out /etc/ssl/certs/localhost.key 2048
RUN openssl req -new -x509 -key /etc/ssl/certs/localhost.key -out /etc/ssl/certs/localhost.cert -days 3650 -subj /CN=localhost
EXPOSE 80 443
