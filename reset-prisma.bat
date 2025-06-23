REM Nettoyage des caches Prisma et des modules
rd /s /q node_modules\.prisma
rd /s /q node_modules\@prisma\client\.prisma
rd /s /q node_modules
del pnpm-lock.yaml

REM Réinstallation des dépendances
pnpm install

REM Synchronisation du schéma avec la base
pnpm prisma db push

REM Régénération du client Prisma
pnpm prisma generate