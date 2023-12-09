if ((Test-Path -Path "package.json") -and (-not (Test-Path "node_modules"))) {  
  npm install  
}
Write-Output "dev reverse proxy is running, make sure you've already setup hosts properly to access local dev env by *.dev.challenge, if you're using proxy, you'll also need to bypass *.dev.challenge in your proxy settings."

$env:NODE_PATH = $(npm root --quiet -g)
node -e @"
var redbird = require('redbird');
redbird({
    port: 80,
    secure: false,
    resolvers:[
      function(host, url, req) {
        if(host == 'api.dev.challenge'){
          return 'http://127.0.0.1:3000'
        }
        if(host == 'app.dev.challenge'){
          return 'http://127.0.0.1:4000'
        }
      }
    ],
    ssl: {
        key: './dev_env/.dev_cert/dev.challenge.pem',
        cert: './dev_env/.dev_cert/dev.challenge.pem',
        port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
    }
});
"@
