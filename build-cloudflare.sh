#!/usr/bin/env sh
# Cloudflare Pages: Build command: sh build-cloudflare.sh
# Cloudflare Pages: Build output directory: dist
set -eu
mkdir -p dist
cp index.html app.html home.html manifest.json sw.js icon.svg icon-192.png dist/
cp _headers dist/_headers
test -f dist/index.html
test -f dist/app.html
test -f dist/home.html
test -f dist/manifest.json
test -f dist/sw.js
echo "BAAC SMART OUTLET POS ready for Cloudflare Pages"
