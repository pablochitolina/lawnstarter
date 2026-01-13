#!/bin/bash
set -e

# Setup SQLite database if it doesn't exist
if [ ! -f database/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch database/database.sqlite
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Execute the main command (php-fpm)
exec "$@"
