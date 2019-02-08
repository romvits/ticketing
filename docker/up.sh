#!/bin/bash

echo "==========================================="
echo "if you want to restart a specific container"
echo "sh restart.sh ticketing_node_dev"
echo "==========================================="

docker-compose up &
cd ../src && npm install
