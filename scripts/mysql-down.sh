#!/bin/bash
cd ../docker
docker-compose down
cd ../scripts

cd ../../ballkartenonline.at/docker
docker-compose down ballkartenonline_db
cd ../../ticketing/scripts
