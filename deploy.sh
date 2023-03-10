#!/bin/bash

cd /

projectRoot="/home/ubuntu/Gecut"
storageServerRoot="$projectRoot/services/storage-server/"
serverRoot="$projectRoot/uniquely/agaah-api/"
pwaRoot="$projectRoot/uniquely/agaah-pwa/"
pwaDist="/var/www/pwa"

cd "$projectRoot"

git pull --prune --progress --autostash --rebase

yarn install && yarn build

pm2 stop all
pm2 del all

cd "$storageServerRoot" && yarn build && pm2 start dist/index.mjs

cd "$serverRoot" && yarn build && pm2 start dist/index.mjs

cd "$pwaRoot" && yarn build && sudo rm -rf "$pwaDist/*" && cp -r dist/* "$pwaDist"

sudo nginx -t && sudo systemctl restart nginx
sudo pm2 save --force
