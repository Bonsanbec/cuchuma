#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
npm ci
npm run build
npm run init
mkdir -p static/uploads
echo "Inicialización completada."
