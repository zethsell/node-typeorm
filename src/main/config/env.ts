import 'dotenv/config'

const enviroment = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
export const env = {

  typeorm: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${enviroment}/infra/repos/postgres/entities/index.{js,ts}`],
    migrations: [`${enviroment}/infra/repos/postgres/migrations/*.{js,ts}`],
    migrationsDir: `${enviroment}/infra/repos/postgres/migrations/`
  },

  port: process.env.SERVER_PORT ?? 8888,
  jwtSecret: process.env.JWT_SECRET ?? '123abc456',
  defaultPass: process.env.DEFAULT_PASS ?? '123abc456'

}
