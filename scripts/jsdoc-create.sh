#!/usr/bin/bash
cd ../jsdoc
./node_modules/.bin/jsdoc ../src/server -r -c ./conf.json -d ../src/www/_docs -p