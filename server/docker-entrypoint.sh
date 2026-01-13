#!/bin/bash
set -e

# Install dependencies if missing
if [ ! -d vendor ]; then
    echo "Installing Composer dependencies..."
    composer install --prefer-source --no-interaction
fi

# Copy .env if missing
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
fi

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
