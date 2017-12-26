#!/usr/bin/env bash
#./build.sh
cp ./package.json ./dist/src/package.json
npm install --prefix ./deploy

# ticketing.appcompelte.at
cd deploy && node_modules/.bin/grunt --ticketing_appcomplete_at --copy && cd ..
cd deploy && node_modules/.bin/grunt --ticketing_appcomplete_at ssh-deploy-release:production && cd ..



cp ./src/config.ini ./dist/src/config.ini
