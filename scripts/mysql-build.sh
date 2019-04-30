#!/bin/bash
cd ../docker
docker-compose down
docker network create ticketing_nat
docker-compose build --force-rm --no-cache
docker-compose up --no-start
cd ../scripts
