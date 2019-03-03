#!/bin/bash

if [[ -z "$1" ]]
then

    echo "========================================="
    echo "if you want to start a specific container"
    echo "sh start.sh ticketing_mysql_dev"
    echo "========================================="

    docker-compose start &
else
    docker-compose start $1 &
fi
