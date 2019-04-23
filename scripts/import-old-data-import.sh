#!/bin/bash
sh mysql-create.sh
cd ../_import_old_data
npm run import
cd ../scripts