#!/usr/bin/env bash
cd src/public/admin_mobile/libs/smartadmin/ && npm install && cd ../../../../..
cd src/public/admin_mobile/libs/smartadmin/ && node_modules/.bin/grunt && cd ../../../../..
