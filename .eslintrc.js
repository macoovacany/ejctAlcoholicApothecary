module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
    },
    env: {
        es6: true,
        browser: true,
        commonjs: true,
        node: true,
        jquery: true,
    },
    globals: {
        $: true,
    },
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended'],
    rules: {
        'no-console': 0,
        'prettier/prettier': ['error'],
    },
};
