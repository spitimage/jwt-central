#!/bin/sh

export NODE_ENV=production

export GOOGLE_ID='<your key here>'
export GOOGLE_SECRET='<your secret here>'

export GITHUB_ID='<your key here>'
export GITHUB_SECRET='<your secret here>'

cd ../app
node app.js
