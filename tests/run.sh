#!/bin/bash

for i in {1..10}
do
    node feList/run.js &
#    node user/run.js &
    node promoter/run.js &
    node location/run.js &
    node event/run.js &
    node floor/run.js &
    sleep 1
done
