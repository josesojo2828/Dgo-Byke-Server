#!/bin/sh

# Detener el script si ocurre un error
set -e

# echo "🛠️  Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "🚀  Iniciando la aplicación con npm run start..."
# Esto ejecutará el script "start" de tu package.json (usualmente "nest start")
npm run start