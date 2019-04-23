#!/bin/bash
# only for testing will be removed if build process with grunt is implemented correctly
rm -rf ../build/docker/node/app
mkdir ../build/docker/node/app
mkdir ../build/docker/node/app/www
mkdir ../build/docker/node/app/server
cp -r ../src/*.js ../build/docker/node/app/
cp -r ../src/*.json ../build/docker/node/app/
cp -r ../src/www/* ../build/docker/node/app/www/
cp -r ../src/server/* ../build/docker/node/app/server/

#cd ../build
#mkdir modules_packaging
#node_modules/.bin/grunt --gruntfile ./GruntfilePackaging.js
#node_modules/.bin/grunt --build --uglify


# DOCKER BUILD AND DEPLOY PROCESS
cd ../build/docker
docker-compose build --force-rm --no-cache
#docker push romarius75/ballkartenonline:ticketing_node
#docker push romarius75/ballkartenonline:ticketing_mysql
