module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/__tests__/**/*.spec.ts'
  ]
};
