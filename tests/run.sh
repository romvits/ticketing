#!/bin/bash

for i in {1..2}
do
    node feList/run.js &
    node floor/run.js &
    node user/run.js &
    sleep 1
done
