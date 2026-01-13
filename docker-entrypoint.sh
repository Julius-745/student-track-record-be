#!/bin/sh
set -e

# Generate JWT_SECRET if not provided
if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET=$(openssl rand -base64 48)
  echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Run the application
exec bun run dist/src/main.js