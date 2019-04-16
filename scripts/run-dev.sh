#!/bin/bash
cd ../docker
docker-compose start &
sleep 3
cd ../src
npm run dev
