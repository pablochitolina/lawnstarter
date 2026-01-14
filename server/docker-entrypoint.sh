#!/bin/bash
set -e

# Install dependencies if missing (or incomplete)
if [ "$1" = "php-fpm" ]; then
    # --- SETUP LOGIC (Only run by the main server container) ---

    # 1. Install dependencies if missing
    if [ ! -f vendor/autoload.php ]; then
        echo "Installing Composer dependencies..."
        
        # Build in temp dir to avoid file locking issues on mounted volumes
        mkdir -p /tmp/build
        cp composer.json /tmp/build/
        # cp composer.lock /tmp/build/ 2>/dev/null || true
        
        cd /tmp/build
        composer clear-cache
        composer install --prefer-dist --no-interaction --no-scripts
        
        # Sync back to host volume
        echo "Syncing vendor directory..."
        # Remove existing vendor dir to avoid "File exists" or nesting issues
        rm -rf /var/www/html/vendor
        cp -r vendor /var/www/html/
        
        # Cleanup
        cd /var/www/html
        rm -rf /tmp/build
        
        # Finalize
        php artisan package:discover
    fi

    # 2. Setup environment
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
        php artisan key:generate
    fi

    # 3. Setup Database
    if [ ! -f database/database.sqlite ]; then
        echo "Creating database.sqlite..."
        touch database/database.sqlite
    fi

    # 4. Run Migrations
    echo "Running migrations..."
    php artisan migrate --force

else
    # --- WORKER/SCHEDULER LOGIC ---
    # Wait for the main server to complete setup
    echo "Waiting for application setup (dependencies, .env)..."
    while [ ! -f vendor/autoload.php ] || [ ! -f .env ]; do
        sleep 2
    done
    echo "Setup detected. Starting service..."
fi

# Execute the main command (php-fpm)
exec "$@"
