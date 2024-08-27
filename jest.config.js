module.exports = {
    verbose: true, // Output more detailed test results
    testEnvironment: 'node', // Use 'jsdom' for browser-like environment
    collectCoverage: true, // Enable coverage reporting
    coverageDirectory: 'coverage', // Directory for coverage reports
    testMatch: ['**/__tests__/**/*.js'], // Glob pattern for test files
};