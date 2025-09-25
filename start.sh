#!/bin/sh

# Set default values for backend connection
export BACKEND_HOST=${BACKEND_HOST:-duc-backend.railway.internal}
export BACKEND_PORT=${BACKEND_PORT:-8080}

echo "=== Railway Deployment Start Script ==="
echo "Backend Host: $BACKEND_HOST"
echo "Backend Port: $BACKEND_PORT"
echo "Node Environment: $NODE_ENV"

# Test backend connectivity
echo "Testing backend connectivity..."
nc -z $BACKEND_HOST $BACKEND_PORT
if [ $? -eq 0 ]; then
    echo "✓ Backend is reachable at $BACKEND_HOST:$BACKEND_PORT"
else
    echo "⚠ Warning: Cannot reach backend at $BACKEND_HOST:$BACKEND_PORT"
fi

# Substitute environment variables in nginx template
echo "Configuring nginx with backend: $BACKEND_HOST:$BACKEND_PORT"
envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Display final nginx configuration for debugging
echo "=== Final nginx configuration ==="
cat /etc/nginx/conf.d/default.conf

# Start nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;'
