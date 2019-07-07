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

        'indent': [
            'error',
            4
        ],

        'space-in-parens': [
            'error',
            'always'
        ],

        'import/extensions': [
            'always'
        ],

    }
};
