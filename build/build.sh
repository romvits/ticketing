#!/bin/bash
node_modules/.bin/grunt --build --uglify
cd docker && docker-compose build
