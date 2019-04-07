#!/bin/bash

for i in {1..1}
do
    node modules/feList/run.js &
#    node modules/user/run.js &
    node modules/promoter/run.js &
    node modules/location/run.js &
    node modules/event/run.js &
    node modules/floor/run.js &
    sleep 1
done
