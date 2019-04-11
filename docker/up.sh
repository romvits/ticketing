#!/bin/bash

if [ -z "$1" ]
then
    echo "===================================================="
    echo "if you want to start all containers"
    echo "sh up.sh all"
    echo ""
    echo "if you want to start a specific container"
    echo "sh up.sh romarius75/ballkartenonline:ticketing_node"
    echo "sh up.sh romarius75/ballkartenonline:ticketing_mysql"
    echo "===================================================="
elif [ "$1" = "all" ]
then
    docker-compose up
else
    docker-compose up $1
fi

