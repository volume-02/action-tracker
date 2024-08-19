/* eslint @typescript-eslint/no-require-imports: 0 */ //can't use import here

const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((acc, val) => {
    acc[`process.env.${val}`] = JSON.stringify(env[val]);
    return acc;
}, {});

module.exports = {
    entry: './src/tracker/tracker.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'tracker.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Tracker',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    plugins: [new webpack.DefinePlugin(envKeys)],
    mode: 'production',
};
