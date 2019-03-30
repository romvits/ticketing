#!/bin/bash
cd docker
docker-compose start &
cd ..
cd src
npm run dev
