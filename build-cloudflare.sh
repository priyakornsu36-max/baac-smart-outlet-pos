#!/usr/bin/env sh
# Cloudflare Pages: Build command: sh build-cloudflare.sh
# Cloudflare Pages: Build output directory: dist
set -eu
mkdir -p dist
cp index.html manifest.json sw.js dist/
cp _headers dist/_headers
test -f dist/index.html
test -f dist/manifest.json
test -f dist/sw.js
echo "BAAC SMART OUTLET POS ready for Cloudflare Pages"
