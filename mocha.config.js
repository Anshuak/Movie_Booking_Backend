// mocha.config.js
module.exports = {
    require: 'dotenv/config', // Load environment variables
    timeout: 10000,           // Set timeout for each test
    recursive: true,          // Look for tests in subdirectories
    spec: 'test/e2e/**/*.test.js', // Specify E2E test files
};
