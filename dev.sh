#!/bin/bash
cd docker
docker-compose start &
sleep 3
cd ..
cd src
npm run dev
