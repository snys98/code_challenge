module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "tsconfigRootDir": "w:\\workspace\\sapia\\code_challenge\\apps\\api",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin"
  ],
  "extends": [
    "plugin:@typescript-eslint/recommended"
  ],
  "root": true,
  "env": {
    "node": true,
    "jest": true
  },
  "ignorePatterns": [
    ".eslintrc.js"
  ],
  "rules": {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": 1
  }
}
