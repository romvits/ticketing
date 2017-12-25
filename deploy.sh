#!/usr/bin/env bash
#grunt --ticketing_appcomplete_at --copy
npm install --prefix ./deploy
cd deploy && node_modules/.bin/grunt --ticketing_appcomplete_at --copy && cd ..
cd deploy && node_modules/.bin/grunt --ticketing_appcomplete_at ssh-deploy-release:production && cd ..

