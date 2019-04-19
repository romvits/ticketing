#!/bin/bash
sh database-create.sh
cd ../_import_old_data
npm run import
cd ../scripts