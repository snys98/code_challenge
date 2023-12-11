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
          return 'http://api.dev.challenge:3000'
        }
        if(host == 'app.dev.challenge'){
          return 'http://app.dev.challenge:4000'
        }
        if(host == 'mongo.dev.challenge'){
          return 'http://mongo.dev.challenge:27017'
        }
        if(host == 'redis.dev.challenge'){
          return 'http://redis.dev.challenge:6379'
        }
        if(host == 'elasticsearch.dev.challenge'){
          return 'http://elasticsearch.dev.challenge:9200'
        }
        if(host == 'apm-server.dev.challenge'){
          return 'http://apm-server.dev.challenge:8200'
        }
        if(host == 'kibana.dev.challenge'){
          return 'http://kibana.dev.challenge:5601'
        }
         if(host == 'logstash.dev.challenge'){
          return 'http://logstash.dev.challenge:9600'
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
