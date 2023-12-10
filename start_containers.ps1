pwsh .\dev_env\init_dev_env.ps1
if (!(Test-Path -Path .\apps\api\node_modules)) {
    npm --prefix .\apps\api install
}else {
  Start-Sleep -s 3
}

npm --prefix .\apps\api run migrate:up
docker-compose up -d
pwsh .\dev_proxy.ps1
