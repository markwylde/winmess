import path from 'path';
import bundle from './helpers/bundle.js';
import run from './helpers/run.js';

const testSuiteBundle = await bundle(path.resolve('./test/suite.js'));

const results = await run(testSuiteBundle);

if (!results.success) {
  throw new Error('not all tests passed');
}

