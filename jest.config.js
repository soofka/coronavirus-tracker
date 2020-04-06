module.exports = {
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    '__tests__',
    'src/service-worker.js',
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
    '<rootDir>/setupTests.js',
  ],
  transform: {
    '.*\\.jsx?$': 'babel-jest',
  },
  testRegex: '__tests__/.*\\.test\\.jsx?$',
  testURL: 'http://localhost',
};
