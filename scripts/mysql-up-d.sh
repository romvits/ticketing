#!/bin/bash
cd ../docker
docker-compose up -d
cd ../scripts

cd ../../ballkartenonline.at/docker
docker-compose up -d ballkartenonline_db
cd ../../ticketing/scripts
