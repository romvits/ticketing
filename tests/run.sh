#!/bin/bash

for i in {1..1000}
do
#    node modules/feList/run.js &
#    node modules/user/run.js &
    node modules/promoter/run.js &
    node modules/location/run.js &
    node modules/event/run.js &
    node modules/floor/run.js &
    node modules/room/run.js &
    node modules/table/run.js &
    node modules/seat/run.js &
    sleep .5
done
