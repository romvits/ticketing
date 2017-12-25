#!/usr/bin/env bash
rm -rf dist
mkdir dist
mkdir dist/docs
mkdir dist/src
npm install
npm run build-server
npm run build-page
npm run build-admin
npm run build-admin_mobile
npm run build-docs
#npm run test