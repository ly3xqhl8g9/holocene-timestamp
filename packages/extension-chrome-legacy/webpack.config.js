const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');



const DEVELOPMENT = 'development';
const { NODE_ENV = DEVELOPMENT } = process.env;

const outputPath = path.join(__dirname, 'distribution');


const base = {
    context: __dirname,
    entry: {
        contentscript: './src/js/contentscript.js',
        popup: './src/js/popup_script.js',
        options: './src/js/options.js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    output: {
        path: outputPath,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: 'css-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/manifest.json', to: 'manifest.json' },
                { from: './src/js/jquery-3.1.1.min.js', to: 'jquery-3.1.1.min.js' },
                { from: './src/icons', to: 'icons' },
                { from: './src/css', to: 'css' },
            ],
        }),
        new HtmlWebpackPlugin({
            template: './src/popup.html',
            chunks: ['popup'],
            filename: 'popup.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/options.html',
            chunks: ['options'],
            filename: 'options.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
            },
        }),
    ],
};


const development = {
    ...base,
    mode: 'development',
    devtool: false,
};


const production = {
    ...base,
    mode: 'production',
    plugins: [
        ...base.plugins,
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
    ],
}


if (NODE_ENV === DEVELOPMENT) {
    module.exports = development;
} else {
    module.exports = production;
}
