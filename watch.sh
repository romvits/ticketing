#!/usr/bin/env bash
echo $1 $2;
if [ "$1" == "--env" ]
then
   commandline=$(npm run $2)
else
   echo "please set --env"
fi
