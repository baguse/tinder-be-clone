##### To run this service:

1. run `npm install`
2. copy `.env.example` to `.env` and change as you needs
   DEV_PORT= your service port will be used
   DEV_DB_NAME= database name
   DEV_DB_HOST= database hostname
   DEV_DB_PORT= database port
   DEV_DB_USERNAME= database username
   DEV_DB_PASSWORD= database password
   DEV_DB_DIALECT= database dialect(postgres,mysql) you can take a look on sequelize page
   DEV_JWT_SECRET= secret key for jwt purpose

   `DEV_` in here is the environment prefix, if you want to use Prdouction env please use the `PRODUCTION_` prefix and don't forget to set `NODE_ENV` as `PRODUCTION`
3. to run on development mode, you can run `npm run dev`

##### [TESTING]

To run the test you can run `npm run test` and to see the coverage you can run `npm run test:coverage`

##### [LINTING]

To run linting you can run `npm run lint` and to fix the linting you can run `npm run lint:fix`

##### [DEPLOYMENT]
To run on docker you can run `docker-compose up --build` and to stop it you can run `docker-compose down`, you just need to copy the `.env.example` to `.env`

This Dockerfile using multistage build, so it will be more efficient and smaller image size

##### [Sequelize]
To run the seeders you needs to build it first using `npm run build` command and to run the seeders itself you can do it using `npx sequelize db:seed:all`
The migration process is skipped because it will be automatically run when the service is started


**Postman url** [Postman](https://www.postman.com/planetary-station-648162/workspace/dealls-test/collection/4733836-e62dbebb-47c7-470e-abc2-36e8478ee034?action=share&creator=4733836&active-environment=4733836-821aefc4-b2cf-4bd8-ba50-317d56268017)

**ERD** [draw.io](https://drive.google.com/file/d/1yVBN9g2RaiJj04MZbyeEZ9K1QKfz0Adm/view?usp=sharing)
**Directory structures**

````
├── .dockerignore => ignore files for docker
├── .env => environment variables
├── .env.example => example of environment variables
├── .github => github actions
├── .gitignore => ignore files for git
├── .mocharc.json => mocha configuration
├── .nyc_output => nyc output
├── .sequelizerc => sequelize configuration
├── Dockerfile => docker configuration
├── README.md => this file
├── coverage => coverage report
├── dist => compiled files
├── docker-compose.yaml => docker compose configuration
├── eslint.config.mjs => eslint configuration
├── migrations => sequelize migrations
├── package-lock.json => npm lock file
├── package.json => npm configuration
├── seeders => sequelize seeders
├── src => source code
    ├── app.ts => express app
    ├── configurations => configurations
    ├── constants => constants used in the app
    ├── controllers => controllers
    ├── interfaces => interfaces for typescript
    ├── main.ts => entry point
    ├── middlewares => middlewares for express
    ├── models => sequelize models
    ├── module-alias-register.ts => module alias register for @paths
    ├── routes => routes for express
    ├── schemas => zod schemas
    ├── tests => mocha tests
    └── utils => utility functions
├── tsconfig.json => typescript configuration
└── uploads => uploaded files
````

##### [CI/CD]
This repository also have github actions for CI/CD purpose, you can take a look on `.github/workflows` directory
