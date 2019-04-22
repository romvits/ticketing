#!/bin/bash
# only for testing will be removed if build process with grunt is implemented correctly
xcopy ../src/* ../build/docker/node/app/
#cd ../build
#mkdir modules_packaging
#node_modules/.bin/grunt --gruntfile ./GruntfilePackaging.js
#node_modules/.bin/grunt --build --uglify


# DOCKER BUILD AND DEPLOY PROCESS
cd docker
docker-compose build --force-rm --no-cache
docker push romarius75/ballkartenonline:ticketing_node
docker push romarius75/ballkartenonline:ticketing_mysql
