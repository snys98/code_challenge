if ((Test-Path -Path "package.json") -and (-not (Test-Path "node_modules"))) {  
  npm install  
}
Write-Output "dev reverse proxy is running, make sure you've already setup hosts properly to access local dev env by *.dev.challenge.io, if you're using proxy, you'll also need to bypass *.dev.challenge.io in your proxy settings."

$env:NODE_PATH = $(npm root --quiet -g)
node -e @"
var redbird = require('redbird');
redbird({
    port: 80,
    secure: false,
    resolvers:[
      function(host, url, req) {
        if(host == 'api.dev.challenge.io'){
          return 'http://api.dev.challenge.io:3000'
        }
        if(host == 'app.dev.challenge.io'){
          return 'http://app.dev.challenge.io:4000'
        }
        if(host == 'mongo.dev.challenge.io'){
          return 'http://mongo.dev.challenge.io:27017'
        }
        if(host == 'redis.dev.challenge.io'){
          return 'http://redis.dev.challenge.io:6379'
        }
        if(host == 'elasticsearch.dev.challenge.io'){
          return 'http://elasticsearch.dev.challenge.io:9200'
        }
        if(host == 'apm-server.dev.challenge.io'){
          return 'http://apm-server.dev.challenge.io:8200'
        }
        if(host == 'kibana.dev.challenge.io'){
          return 'http://kibana.dev.challenge.io:5601'
        }
         if(host == 'logstash.dev.challenge.io'){
          return 'http://logstash.dev.challenge.io:9600'
        }
      }
    ],
    ssl: {
        key: './env/certs/dev.challenge.io.pem',
        cert: './env/certs/dev.challenge.io.pem',
        port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
    }
});
"@
