#!/bin/bash

cd ../src && npm install

if [[ -z "$1" ]]
then

    echo "==========================================="
    echo "if you want to restart a specific container"
    echo "sh restart.sh ticketing_node_dev"
    echo "==========================================="

    docker-compose restart &
else
    docker-compose restart $1 &
fi
