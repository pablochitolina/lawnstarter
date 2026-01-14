#!/bin/sh
set -e

if [ ! -f "node_modules/.bin/vite" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

exec "$@"
