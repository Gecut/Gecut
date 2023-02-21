#!/usr/bin/env bash

projectRoot="~/Gecut/"
storageServerRoot="$projectRoot/services/storage-server/"
serverRoot="$projectRoot/server/agah-api/"
pwaRoot="$projectRoot/uniquely/ui/agah-pwa/"
pwaDist="/var/www/html"

git pull --prune --progress --autostash --rebase

yarn build

cd "$storageServerRoot"
yarn build
pm2 start dist/index.mjs

cd "$serverRoot"
yarn build
pm2 start dist/index.mjs

cd "$pwaRoot"
yarn build
sudo rm -rf "$pwaDist/*"
cp build/* "$pwaDist"

sudo nginx -t
sudo systemctl restart nginx
