#!/bin/bash
cd ../../ballkartenonline.at/docker
docker-compose up -d ballkartenonline_db
echo "sleep 5"
sleep 5
cd ../../ticketing/_import_old_data
npm run create
cd ../scripts
