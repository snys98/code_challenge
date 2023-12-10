docker-compose -f .\dev_env\docker-compose.yml setup -d
docker-compose -f .\dev_env\docker-compose.yml up -d
npm --prefix ./apps/api install
npm --prefix ./apps/api run migrate:up
docker-compose up -d
