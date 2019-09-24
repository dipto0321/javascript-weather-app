module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "quotes": 0,
        "indent": 0,
        "eol-last": 0,
        "no-use-before-define": 0,
        "camelcase": 0,
        "no-unused-expressions": 0
    }
};