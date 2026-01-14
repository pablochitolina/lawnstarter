#!/bin/bash
set -e

# Install dependencies if missing (or incomplete)
if [ ! -f vendor/autoload.php ]; then
    echo "Installing Composer dependencies (in temp dir to avoid file locking)..."
    
    # 1. Setup temp build area
    mkdir -p /tmp/build
    cp composer.json /tmp/build/
    # cp composer.lock /tmp/build/ 2>/dev/null || true # If we had one
    
    # 2. Install inside the container (fast Linux FS)
    cd /tmp/build
    composer clear-cache
    composer install --prefer-dist --no-interaction --no-scripts
    
    # 3. Move vendor directory back to the mounted volume
    echo "Syncing vendor directory to host..."
    cp -r vendor /var/www/html/
    
    # 4. Cleanup and return
    cd /var/www/html
    rm -rf /tmp/build
    
    # 5. Finalize (run the scripts we skipped)
    php artisan package:discover
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
