#!/bin/bash

if [ -z "$1" ]
then
    echo "======================================================="
    echo "if you want to start all containers"
    echo "sh start.sh all"
    echo ""
    echo "if you want to start a specific container"
    echo "sh start.sh romarius75/ballkartenonline:ticketing_node"
    echo "sh start.sh romarius75/ballkartenonline:ticketing_mysql"
    echo "======================================================="
elif [ "$1" = "all" ]
then
    docker-compose start
else
    docker-compose start $1
fi

