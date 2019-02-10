#!/bin/bash
mkdir modules_packaging
node_modules/.bin/grunt --gruntfile ./GruntfilePackaging.js
node_modules/.bin/grunt --build --uglify
cd docker && docker-compose build
