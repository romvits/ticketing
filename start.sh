#!/usr/bin/env bash
echo $1 $2;
if [ "$1" == "--restart" ]
then
   npm run stop-dist
   npm run build-server
   npm run start-dist
else
   npm run build-server
   npm run start-dist
fi

