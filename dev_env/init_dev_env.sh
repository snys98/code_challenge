#!/bin/bash
echo "please make sure the following conditions are met before executing this script."
echo "1. run as *administrator*"
echo "2. have internet access to package manager mirrors"
echo "3. local 80/443 port is not occupied (such as iis)"
echo "this script will instal a dev cert into your local machine and add it to trusted root store, so that you can access https://*.dev.sapia.ai for your local development, you'll need to restart your browser after this script is executed to ensure the cert is loaded."
read -p "enter 'y' to continue: " continue
if [ "$continue" != "y" ]; then
  exit
fi
cd "$(dirname "$0")"
cert=$(openssl x509 -noout -text -in /etc/ssl/certs/dev.sapia.ai.pem)
if [ -z "$cert" ]; then
  if ! command -v openssl &> /dev/null; then
    apt-get install openssl
  fi
  mkdir -p ./.dev_cert
  openssl req -x509 -nodes -days 365000 -newkey rsa:2048 -keyout ./.dev_cert/dev.sapia.ai.pem -out ./.dev_cert/dev.sapia.ai.pem -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com"
  openssl pkcs12 -export -out ./.dev_cert/dev.sapia.ai.pfx -inkey ./.dev_cert/dev.sapia.ai.pem -in ./.dev_cert/dev.sapia.ai.pem -password pass:dev.sapia.ai
  docker-compose up setup -d
  docker-compose up -d
fi
if ! command -v npm &> /dev/null; then
  apt-get install nodejs
fi
curDir=$(pwd)
for d in ../apps/*/ ; do
  if [ -f "$d/package.json" ] && [ ! -d "$d/node_modules" ]; then
    cd "$d"
    echo "Running npm install in $d"
    npm install
    cd "$curDir"
  fi
done
