#!/usr/bin/env bash
set -e

echo "==================================================================="
echo "Building Production Artifacts (Frontend + Backend)"
echo "==================================================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "Step 1: Building React Frontend..."
cd "$DIR/frontend"
npm install --prefer-offline || npm install
npm run build

echo "Step 2: Bundling frontend into backend static resources..."
mkdir -p "$DIR/backend/src/main/resources/static"
cp -r "$DIR/frontend/dist/"* "$DIR/backend/src/main/resources/static/"

echo "Step 3: Packaging Spring Boot JAR with Maven..."
cd "$DIR/backend"
mvn clean package -DskipTests

echo "==================================================================="
echo "SUCCESS! Production JAR generated at:"
echo "$DIR/backend/target/library-management-system-1.0.0.jar"
echo "==================================================================="
