/**
 * Jest Configuration File
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  maxWorkers: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**'],
  coverageReporters: ['text', 'lcov'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@database/(.*)$': '<rootDir>/src/database/$1',
  },
  coverageDirectory: '.coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
