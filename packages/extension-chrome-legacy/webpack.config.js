const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { version } = require('./package.json');

module.exports = (_environment, argv) => ({
  context: __dirname,
  mode: argv.mode ?? 'development',
  target: ['web', 'es2022'],
  entry: { contentscript: './src/contentscript.ts', background: './src/background.ts', popup: './src/popup.ts', options: './src/options.ts' },
  output: { path: path.join(__dirname, 'distribution'), filename: '[name].js', clean: true },
  devtool: argv.mode === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: { 'holocene-timestamp-parser': path.resolve(__dirname, '../holocene-timestamp-parser/src/index.ts') },
  },
  module: { rules: [{ test: /\.ts$/, use: { loader: 'ts-loader', options: { transpileOnly: true, configFile: path.resolve(__dirname, '../../tsconfig.json') } }, exclude: /node_modules/ }] },
  plugins: [
    new CopyPlugin({ patterns: [
      { from: 'src/manifest.json', to: 'manifest.json', transform(content) { const manifest = JSON.parse(content.toString()); manifest.version = version; return JSON.stringify(manifest, null, 2) + '\n'; } },
      { from: 'src/icons', to: 'icons' },
      { from: 'src/css', to: 'css' },
      { from: 'src/emiliani', to: 'emiliani' },
    ] }),
    ...['popup', 'options'].map(name => new HtmlWebpackPlugin({ template: `src/${name}.html`, chunks: [name], filename: `${name}.html`, scriptLoading: 'defer' })),
  ],
});
