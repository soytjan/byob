module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/wizarding_family_trees',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
