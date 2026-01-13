#!/bin/sh
set -e

# Generate JWT_SECRET if not provided
if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET=$(openssl rand -base64 48)
  echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done
echo "Database is up!"

# Run database seeding
echo "Seeding admin user..."
bun run src/database/seeds/seed-admin.ts || true

# Run the application
echo "Starting application..."
exec bun run dist/src/main.js