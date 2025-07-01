#!/bin/bash

# Build all micro-frontends for production

echo "🔨 Building all micro-frontends..."

# Build Shell
echo "📦 Building Shell..."
cd ecommerce-shell
yarn build --configuration=production
cd ..

# Build Products
echo "📦 Building Products..."
cd ecommerce-products
yarn build --configuration=production
cd ..

# Build Cart
echo "📦 Building Cart..."
cd ecommerce-cart
yarn build --configuration=production
cd ..

# Build Profile
echo "📦 Building Profile..."
cd ecommerce-profile
yarn build --configuration=production
cd ..

echo "✅ All builds completed!"
