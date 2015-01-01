#!/bin/sh

keydir=../app/keys/production
rm -rf $keydir
mkdir -p $keydir
openssl genrsa 2048 > $keydir/rsa-private.pem
openssl rsa -in $keydir/rsa-private.pem -pubout > $keydir/rsa-public.pem
