#!/bin/bash
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
    npm install
fi

echo "dev reverse proxy is running, make sure you've already setup hosts properly to access local dev env by *.dev.sapia.ai, if you're using proxy, you'll also need to bypass *.dev.sapia.ai in your proxy settings."

export NODE_PATH=$(npm root --quiet -g)

node -e "
var redbird = require('redbird');
redbird({
    port: 80,
    secure: false,
    resolvers:[
        function(host, url, req) {
            if(host == 'api.dev.sapia.ai'){
                return 'http://127.0.0.1:3000'
            }
            if(host == 'app.dev.sapia.ai'){
                return 'http://127.0.0.1:4000'
            }
        }
    ],
    ssl: {
        key: './dev_env/.dev_cert/dev.sapia.ai.pem',
        cert: './dev_env/.dev_cert/dev.sapia.ai.pem',
        port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
    }
});
"
