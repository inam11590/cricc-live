#!/usr/bin/env node
/* eslint-disable */

/**
 * CricLive Test Runner
 * Executes unit tests using Node.js built-in test runner and jiti for TypeScript module resolution.
 */

const path = require('path');
const fs = require('fs');

const jiti = require('jiti')(process.cwd(), {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
  cache: false,
  jsx: true,
});

const testsDir = path.resolve(process.cwd(), 'tests');
const testFiles = fs
  .readdirSync(testsDir)
  .filter((file) => file.endsWith('.test.ts'))
  .map((file) => path.join(testsDir, file));

console.log(`\n🏏 Running CricLive Test Suite (${testFiles.length} test modules)...\n`);

for (const testFile of testFiles) {
  jiti(testFile);
}
