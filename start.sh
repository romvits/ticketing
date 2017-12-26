#!/usr/bin/env bash
echo $1 $2;
if [ "$1" == "--restart" ]
then
   npm run dist-stop
   npm run build-server
   npm run dist-start
else
   npm run build-server
   npm run dist-start
fi

