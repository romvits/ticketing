#!/bin/bash

cd /var/www/vhosts/ballcomplete.at/aea/htdocs/releases/_appcomplete/
tar -zcf /var/www/aea.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/boku/htdocs/releases/_appcomplete/
tar -zcf /var/www/boku.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/bph/htdocs/releases/_appcomplete/
tar -zcf /var/www/bph.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/hbb/htdocs/releases/_appcomplete/
tar -zcf /var/www/hbb.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/ibc/htdocs/releases/_appcomplete/
tar -zcf /var/www/ibc.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/jur/htdocs/releases/_appcomplete/
tar -zcf /var/www/jur.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/lnc/htdocs/releases/_appcomplete/
tar -zcf /var/www/lnc.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/pdt/htdocs/releases/_appcomplete/
tar -zcf /var/www/pdt.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/tub/htdocs/releases/_appcomplete/
tar -zcf /var/www/tub.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/voa/htdocs/releases/_appcomplete/
tar -zcf /var/www/voa.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/www/htdocs/releases/_appcomplete/
tar -zcf /var/www/www.tar.gz DATEN &

cd /var/www/vhosts/ballcomplete.at/zbb/htdocs/releases/_appcomplete/
tar -zcf /var/www/zbb.tar.gz DATEN &
