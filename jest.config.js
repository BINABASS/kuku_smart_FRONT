module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
}
