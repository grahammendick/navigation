module.exports = {
  preset: 'react-native',
  setupFiles: [
    "./node_modules/navigation-react-native/setup-jest.js",
    "./setup-jest.js",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|navigation-react-native|react-native-safe-area-context)/)"
  ]
};
