module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['packages'],
  moduleNameMapper: {
    '^react-haru$': '<rootDir>/src/index.ts',
  },
  transform: {
    '\\.tsx?$': ['esbuild-jest'],
  },
  timers: 'fake',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  testPathIgnorePatterns: ['.+/(types|__snapshots__)/.+'],
}
