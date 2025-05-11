@echo off
echo Démarrage des conteneurs...

echo 1. Création du réseau Docker...
docker network create auth-network

echo 2. Démarrage de Supabase...
cd supabase\docker
docker compose up -d
cd ..\..

echo 3. Connexion des conteneurs Supabase au réseau auth-network...
docker network connect auth-network supabase-kong
docker network connect auth-network supabase-db
docker network connect auth-network supabase-auth
docker network connect auth-network supabase-rest
docker network connect auth-network supabase-storage
docker network connect auth-network supabase-meta
docker network connect auth-network supabase-studio
docker network connect auth-network supabase-edge-functions
docker network connect auth-network supabase-pooler
docker network connect auth-network supabase-analytics
docker network connect auth-network supabase-vector
docker network connect auth-network supabase-imgproxy
docker network connect auth-network realtime-dev.supabase-realtime

echo 4. Démarrage du backend...
cd backend
docker build -t sinexo/auth-service:latest .
docker run -d -p 3000:3000 --name backend-container --env-file .env --network auth-network sinexo/auth-service:latest
cd ..

echo 5. Démarrage du frontend...
cd frontend
docker build -t sinexo/auth-frontend:latest .
docker run -d -p 80:80 --name frontend-container --network auth-network sinexo/auth-frontend:latest
cd ..

echo 6. Vérification des conteneurs...
docker ps

echo 7. Déploiement de la stack Supabase sur Kubernetes...
kubectl apply -f k8s/supabase-configmap.yaml
kubectl apply -f k8s/supabase-secrets.yaml
kubectl apply -f k8s/supabase-db-deployment.yaml
kubectl apply -f k8s/supabase-auth-deployment.yaml
kubectl apply -f k8s/supabase-rest-deployment.yaml
kubectl apply -f k8s/supabase-realtime-deployment.yaml
kubectl apply -f k8s/supabase-kong-deployment.yaml
kubectl apply -f k8s/supabase-studio-deployment.yaml
kubectl apply -f k8s/supabase-analytics-deployment.yaml
kubectl apply -f k8s/supabase-ingress.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
echo.
echo Stack Supabase déployée sur Kubernetes !
echo.
echo Frontend et backend déployés sur Kubernetes !
echo Frontend accessible sur : http://localhost
echo Backend accessible sur : http://localhost:3000
echo Supabase accessible sur : http://localhost:8000