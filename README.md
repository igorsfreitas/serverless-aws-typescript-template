## Description

[Serverless](https://www.serverless.com) framework for serverless architecture on AWS.

## Configuração do AWS CLI

- Configure thel [AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
- Your credentials are available at [AWS_ACCOUNTS](https://{{url}}.awsapps.com/start)
- For development environment, set the AWS_ACCOUNT_ID environment variable

```bash Linux
$ export AWS_ACCOUNT_ID="068954941135"
```

```bash Windows
$ SET AWS_ACCOUNT_ID="068954941135"
```

## Install dependencies

```bash
# npm
$ npm install
# yarn
$ yarn
```

## Running the app

```bash
# development watch mode
$ npm run dev
```

## Test

```bash
# unit tests
$ npm run test
```

## Lint

```bash
# check lint
$ npm run lint
```

## Create new module

```bash
# creates the base structure of a module, using the http event type
$ npm run create:module <module_name>
```

## Update Swagger

```bash
# creates the base structure of a module, using the http event type
$ npm run swagger:generate
```

## Documentations

- [Class Validator](https://www.npmjs.com/package/class-validator)
- [Class Transform](https://www.npmjs.com/package/class-transformer)
- [Working with DTOs: Validations and Transformations]()
- [Event Management with Handlers]()
- [Working with Entities]()
- [Controllers]()
- [Services]()
- [Recording Logs]()
- [Repositories - DynamoDB]()
- [Repositories - SQS]()
- [Redis Client]()
- [Swagger]()
