#!/bin/bash
cd ../docker/mysql
for filename in ./sql/*.sql; do
    echo $filename
    docker exec -i ticketing_mysql_dev_container mysql -u root --password=h4G7f8OP < $filename
done