@echo off
echo Arrêt des conteneurs...

echo 1. Arrêt du frontend...
docker stop frontend-container
docker rm frontend-container

echo 2. Arrêt du backend...
docker stop backend-container
docker rm backend-container

echo 3. Arrêt de Supabase...
cd supabase\docker
docker compose down
cd ..\..

echo 4. Suppression du réseau Docker...
docker network rm auth-network

echo 5. Vérification des conteneurs...
docker ps

echo.
echo Les conteneurs sont arrêtés ! 