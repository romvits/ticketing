#!/bin/bash
cd src && npm install
docker-compose rm -f -v
docker volume prune -f
docker-compose build --force-rm --no-cache
docker-compose up &
