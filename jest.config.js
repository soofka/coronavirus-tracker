module.exports = {
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'js',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'tests',
    'src/app.js',
    'src/commons.js',
    'src/index.js',
    'src/service-worker.js',
    'src/sw-webpack-plugin.js',
  ],
  coverageReporters: [
    'html',
    'text',
    'text-lcov',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: [
    'jest-extended',
  ],
  testRegex: 'tests/(unit|snapshot)/.*\\.test\\.js$',
  testURL: 'http://localhost',
};
