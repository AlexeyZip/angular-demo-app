/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.jest.spec.ts'],
  moduleNameMapper: {
    '^ui$': '<rootDir>/projects/ui/src/public-api.ts',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular|rxjs))'],
  coverageDirectory: '<rootDir>/coverage/jest',
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.ts', 'projects/**/*.ts', '!**/*.spec.ts', '!**/*.jest.spec.ts'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
