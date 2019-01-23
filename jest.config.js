module.exports = {
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ['<rootDir>/src/tests/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/']
}
