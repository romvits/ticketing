#!/bin/bash

docker-compose down
docker-compose rm -f -v
docker volume prune -f
docker-compose build --force-rm --no-cache

docker-compose up ticketing_mysql_dev &

cd ../src && npm install
