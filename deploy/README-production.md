# Despliegue en Linux con Apache

## Requisitos

- Node.js 20 o superior.
- PostgreSQL 15 o superior.
- Apache con `proxy`, `proxy_http`, `headers`, `rewrite` y `ssl`.
- Certbot con Let's Encrypt para `cuchuma.bonsanbec.dev`.

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar valores reales:

- `DATABASE_URL`: conexión PostgreSQL usada por Prisma.
- `PUBLIC_SITE_URL`: URL pública canónica.
- `SESSION_COOKIE_NAME`: nombre de cookie de sesión.
- `SESSION_TTL_DAYS`: duración de sesiones persistentes.
- `STORAGE_DRIVER`: `local`; preparado para sustituirse por S3 detrás de la abstracción.
- `LOCAL_STORAGE_ROOT`: ruta donde se guardan archivos subidos.
- `LOCAL_STORAGE_PUBLIC_PATH`: ruta pública servida por SvelteKit.
- `ADMIN_EMAIL`: correo del administrador inicial.
- `ADMIN_PASSWORD`: contraseña inicial de al menos 12 caracteres.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`: envío de recuperación de contraseña.

## Inicialización

```bash
cp .env.example .env
npm ci
npm run build
npm run init
```

## Apache y servicio

```bash
sudo cp deploy/cuchuma.service /etc/systemd/system/cuchuma.service
sudo systemctl enable --now cuchuma
sudo cp deploy/apache-cuchuma.conf /etc/apache2/sites-available/cuchuma.conf
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo a2ensite cuchuma
sudo certbot --apache -d cuchuma.bonsanbec.dev
sudo systemctl reload apache2
```

## Despliegues posteriores

```bash
APP_DIR=/opt/cuchuma SERVICE=cuchuma ./scripts/deploy.sh
```
