const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        '^c/portfolioTheme$': '<rootDir>/jest-stubs/cssModule.js'
    },
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver']
};
