#!/bin/bash

docker-compose down
docker-compose build --force-rm --no-cache

docker-compose up ticketing_mysql_name

#cd ../src && npm install
