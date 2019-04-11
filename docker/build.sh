#!/bin/bash
docker-compose down
docker-compose build --force-rm --no-cache
