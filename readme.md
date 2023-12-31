# Code Challenge

Code challenge project.

[![Docker Image CI](https://github.com/snys98/code_challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/snys98/code_challenge/actions/workflows/ci.yml) [![Docker Image CD](https://github.com/snys98/code_challenge/actions/workflows/cd.yml/badge.svg)](https://github.com/snys98/code_challenge/actions/workflows/cd.yml)

## Tech Stack

- Backend(based on [Nest.js](https://nestjs.com/)):

  - ORM: [Mongoose](https://mongoosejs.com/)
  - Database: [MongoDB](https://www.mongodb.com/)
  - Cache: [Redis](https://redis.io/)
  - Authentication: Local [JWT](https://jwt.io/)
  - Authorization(Todo): [Casbin](https://casbin.org/) - [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control)
  - Message Queue(Todo): [rabbitmq](https://docs.nestjs.com/microservices/rabbitmq)
  - Logging: [elk](https://www.elastic.co/what-is/elk-stack)
  - Migration: [migrate-mongoose](https://github.com/balmasi/migrate-mongoose)
- Frontend(very simple and basic, based on [React](https://reactjs.org/)):

  - UI: [Ant Design](https://ant.design/)
- TaskScheduler(Todo): [node-schedule](https://github.com/node-schedule/node-schedule)
- CI/CD:

  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)
  - [Github Actions](https://docs.github.com/en/actions)
- Misc:

  - Testing: [Jest](https://jestjs.io/)

## Getting Started

Prerequisites:

- [Docker](https://www.docker.com/)
- [pwsh@^7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4)

1. Copy and paste the `.\hosts` file content to your hosts file(or use [switchhosts](https://github.com/oldj/SwitchHosts) for better hosts management).
2. run script in repo root folder using pwsh with administrator permission, and follow instructions

```pwsh
.\start_containers.ps1
```

2. open browser and access the frontend at [https://app.dev.challenge.io](https://app.dev.challenge.io) and the backend at [https://api.dev.challenge.io](https://api.dev.challenge.io), swagger endpoint is at `/swagger`.

> Note: This project will setup a fresh local dev environment with all the dependencies running in docker containers, these dependencies may conflict with your local environment, port reservations: [6379, 27017, 9200, 9300, 8200, 9600, 5044, 50000,, 5601].
> If you already have some of the dependencies installed, please ensure they are not running before starting the project.

list of endpoints:

- [kibana](http://kibana.dev.challenge.io:5601)
- [elasticsearch](http://elasticsearch.dev.challenge.io:9200)
- [redis](http://redis.dev.challenge.io:6379)
- [mongodb](http://mongo.dev.challenge.io:27017)
- [apm-server](http://apm-server.dev.challenge.io:8200)
- [logstash](http://logstash.dev.challenge.io:9600)
- [api-health-check](https://api.dev.challenge.io)
- [api-swagger](https://api.dev.challenge.io/swagger)
  - [api-swagger-json](https://api.dev.challenge.io/swagger/json)
  - [api-swagger-yaml](https://api.dev.challenge.io/swagger/yaml)
- [app](https://app.dev.challenge.io)

## Development

Recommendations for better dev experience:

- Use [vscode workspace](https://code.visualstudio.com/docs/editor/workspaces) to open this project.
- Install recommended vscode extensions.

Steps to run the project:

1. Copy and paste the `.\hosts` file content to your hosts file(or use [switchhosts](https://github.com/oldj/SwitchHosts) for better hosts management).Clone the project and
2. Open prject with vscode
3. Open file `./.vscode/code_challenge.code-workspace` and press the `Open Workspace` button
4. Press `F1` and type `tasks: run task` and select `compose dev dependencies` task, wait for the dependencies to start(you might need to restart vscode after this step).
5. Ensure all the dependencies in stack of `dev_env` are running(except for `setup`), status should be like this.
   ![1702222429452](images/readme/1702222429452.png)
6. Press `F1` and type `tasks: run task` and select `npm`, then select `npm install` in `ROOT` folder.
7. Press `F1` and type `tasks: run task` and select `start dev reverse proxy` task.
8. Ping `redis` to ensure the hosts file is configured correctly and the target should your localhost.
9. Press `F1` and type `tasks: run task` and select `build all` task, new stack of `code_challenge` should be running, and status should be like this.
   ![1702223602760](images/readme/1702223602760.png)
10. Press `F1` and type `tasks: run task` and select `migrate up` task for generating test data.
11. Access the frontend at [https://app.dev.challenge.io](https://app.dev.challenge.io) and the backend at [https://api.dev.challenge.io](https://api.dev.challenge.io), swagger endpoint is at `/swagger`.

> see `.\env\docker-compose` file for docker container dependencies
> see `.\env\.env` file for elasticsearch and kibana passwords
> see `.\apps\api\.env.dev` file for api environment variables

## Testing

In the project root directory, run `npm run test` to run all the tests.

## Deployment

See `./.github/workflows/cd.yml` for deployment details.

## Q&A

todo
