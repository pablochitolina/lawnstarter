#!/bin/bash
set -e

# Setup SQLite database if it doesn't exist
if [ ! -f database/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch database/database.sqlite
fi

# Run migrations only if this is the main server container (running php-fpm)
if [ "$1" = "php-fpm" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

# Execute the main command (php-fpm)
exec "$@"
