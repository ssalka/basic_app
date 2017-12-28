const isTestEnv = process.env.NODE_ENV === 'test';

import(isTestEnv ? 'test' : 'src/server');
