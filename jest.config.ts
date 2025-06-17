/**
 * Jest Configuration File
 * https://jestjs.io/docs/configuration
 */

import fs from 'fs';
import type { Config } from 'jest';
import path from 'path';

const swcConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.swcrc'), 'utf-8'),
);

const config: Config = {
  maxWorkers: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest', swcConfig],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverage: false,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 20000,
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**'],
  coverageReporters: ['text', 'lcov'],
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '.coverage',
};

export default config;
