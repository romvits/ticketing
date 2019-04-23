#!/bin/bash

for i in {1..3}
do
#    node ../tests/modules/feList/run.js &
#    node ../tests/modules/user/run.js &
    node ../tests/modules/promoter/run.js &
    node ../tests/modules/location/run.js &
    node ../tests/modules/event/run.js &
    node ../tests/modules/floor/run.js &
    node ../tests/modules/room/run.js &
    node ../tests/modules/table/run.js &
    node ../tests/modules/seat/run.js &
    node ../tests/modules/order/run.js &
    sleep 3
done
