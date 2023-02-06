const { env } = require('./dist/main/config/env')

module.exports = {
  type: env.typeorm.type,
  host: env.typeorm.host,
  port: env.typeorm.port,
  username: env.typeorm.username,
  password: env.typeorm.password,
  database: env.typeorm.database,
  entities: env.typeorm.entities,
  migrations: env.typeorm.migrations,
  cli: {
    migrationsDir: env.typeorm.migrationsDir
  }
}
