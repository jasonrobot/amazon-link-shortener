module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",

        "browser": "readonly",

        "describe": "readonly",
        "it": "readonly",
        "expect": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {

        "indent": [
            "error",
            4
        ]

    }
};
