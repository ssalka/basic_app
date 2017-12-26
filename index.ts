const entryFilesByEnv = {
  production: 'src/server',
  development: 'src/server.dev',
  test: 'test'
};

const matchedEntryFile = entryFilesByEnv[process.env.NODE_ENV];

if (!matchedEntryFile) {
  console.warn(
    `\nUnknown environment \`${process.env.NODE_ENV}\` -- running in development mode\n`
  );
}

import(matchedEntryFile || entryFilesByEnv.development);
