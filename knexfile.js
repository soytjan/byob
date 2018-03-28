module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/wizarding_family_trees',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
