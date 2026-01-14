#!/bin/bash
set -e

echo "   Stopping containers and removing volumes..."
docker-compose down -v

echo "    Deleting local database and dependency folders (to force clean install)..."
rm -f server/database/database.sqlite
rm -rf server/vendor client/node_modules

echo "   Rebuilding and Starting..."
docker-compose up -d --build

echo "   Done! The app is starting up."
echo "   It might take a minute for the database to be created and migrations to run."
echo "   You can follow the logs with: docker-compose logs -f server"
