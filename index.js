const entryFile = {
  production: 'src/server',
  development: 'src/server.dev',
  test: 'test'
}[process.env.NODE_ENV];

require(entryFile);
