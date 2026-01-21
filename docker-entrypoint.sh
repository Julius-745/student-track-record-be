#!/bin/sh
set -e

# Generate JWT_SECRET if not provided
if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET=$(openssl rand -base64 48)
  echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" > /dev/null 2>&1; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Database failed to become ready after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "Database is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done
echo "Database is up!"

# Run database seeding
echo "Seeding admin user..."
if bun run src/database/seeds/seed-admin.ts; then
  echo "Admin user seeded successfully!"
else
  echo "Warning: Admin seeding failed, but continuing..."
fi

# Run the application
echo "Starting application..."
exec bun run dist/src/main.js