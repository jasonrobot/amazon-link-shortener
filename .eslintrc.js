module.exports = {
    env: {
        browser: true,
        es6: true,
        'jest/globals': true,
    },
    extends: 'airbnb',
    plugins: [
        'jest'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',

        browser: 'readonly',

    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'array-bracket-spacing': [
            'error',
            'always',
        ],

        'indent': [
            'error',
            4
        ],

        'import/extensions': [
            'always'
        ],

        'space-in-parens': [
            'error',
            'always'
        ],

    }
};
