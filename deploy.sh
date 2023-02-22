#!/bin/bash

cd /

projectRoot="/home/ubuntu/Gecut"
storageServerRoot="$projectRoot/services/storage-server/"
serverRoot="$projectRoot/server/agah-api/"
pwaRoot="$projectRoot/uniquely/ui/agah-pwa/"
pwaDist="/var/www/pwa"

cd "$projectRoot"

git pull --prune --progress --autostash --rebase

yarn build

pm2 stop all
pm2 del all

cd "$storageServerRoot" && yarn build && pm2 start dist/index.mjs

cd "$serverRoot" && yarn build && pm2 start dist/index.mjs

cd "$pwaRoot" && yarn build && sudo rm -rf "$pwaDist/*" && cp -r build/* "$pwaDist"

sudo nginx -t && sudo systemctl restart nginx
sudo pm2 save --force
