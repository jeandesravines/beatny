# @beatny/api-graphql

Secret project using Spotify API.

## Getting started

- Read the [project documentation](https://gitlab.com/jeandesravines/beatny/blob/develop/README.md)
- Create a `.env` file containing all the required [environment variables](docs/ENVIRONMENT_VARIABLES.md)
- [Build and Run](#build-and-run) the service

## Build and Run

```shell
docker build --target workspace --tag beatny_api_graphql .
docker run --rm -it -p 8080:8080 --env-file .env beatny_api_graphql yarn dev
```

## Test

```shell
docker run --rm -it --env-file .env.test beatny_api_graphql yarn lint
docker run --rm -it --env-file .env.test beatny_api_graphql yarn test
```

## Documentation

- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)

## Contributing

See the [project contribution guide](https://gitlab.com/jeandesravines/beatny/blob/develop/CONTRIBUTING.md).
