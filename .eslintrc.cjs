module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:solid/typescript'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    es6: true,
    browser: true,
    es2021: true
  },
  plugins: ['@typescript-eslint', 'prettier', 'solid'],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/ban-ts-comment":"off"
  },
  ignorePatterns: ['node_modules'],
}
