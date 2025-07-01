#!/bin/bash

echo "🚀 Starting deployment..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "🗑️ Cleaning up..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check container status
echo "📊 Container status:"
docker-compose ps

# Test endpoints
echo "🧪 Testing endpoints..."
curl -f http://localhost:9080/health || echo "❌ Proxy health check failed"
curl -f http://localhost:8081/ || echo "❌ Products health check failed"
curl -f http://localhost:8082/ || echo "❌ Cart health check failed"
curl -f http://localhost:8083/ || echo "❌ Profile health check failed"

echo "✅ Deployment completed!"
echo "🌐 Application available at:"
echo "   - Main App (Proxy): http://localhost:9080"
echo "   - Shell Direct: http://localhost:8081"
echo "   - Products Direct: http://localhost:8082"
echo "   - Cart Direct: http://localhost:8083"
echo "   - Profile Direct: http://localhost:8084"
