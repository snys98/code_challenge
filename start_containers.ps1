docker-compose -f .\dev_env\docker-compose.yml up setup
docker-compose -f .\dev_env\docker-compose.yml up -d
if (!(Test-Path -Path .\apps\api\node_modules)) {
    npm --prefix .\apps\api install
}else {
  Start-Sleep -s 3
}

npm --prefix .\apps\api run migrate:up
docker-compose up -d
