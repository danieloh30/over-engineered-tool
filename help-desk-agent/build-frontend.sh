#!/bin/bash

# Build the React frontend and copy to Quarkus static resources

echo "🎨 Building React frontend..."
cd src/main/webui
npm run build

echo "📦 Copying frontend to Quarkus resources..."
mkdir -p ../resources/META-INF/resources
cp -r dist/* ../resources/META-INF/resources/

echo "✅ Frontend built and copied successfully!"
echo "💡 Run './mvnw quarkus:dev' to start the application with the new frontend"
