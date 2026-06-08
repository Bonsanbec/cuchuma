#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/cuchuma}"
SERVICE="${SERVICE:-cuchuma}"

cd "$APP_DIR"
git pull --ff-only
npm ci --omit=dev
npm run prisma:generate
npm run prisma:migrate
npm run build
systemctl restart "$SERVICE"
systemctl reload apache2
echo "Despliegue completado."
