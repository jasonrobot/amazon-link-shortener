module.exports = {
    env: {
        browser: true,
        es6: true
    },
    // extends: 'eslint:recommended',
    extends: 'airbnb',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',

        browser: 'readonly',

        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly'
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
