const path = require('node:path');
const common = {
  entry: './src/index.ts',
  context: __dirname,
  target: ['web', 'es2022'],
  resolve: { extensions: ['.ts', '.js'] },
  module: { rules: [{ test: /\.ts$/, use: { loader: 'ts-loader', options: { transpileOnly: true, configFile: path.resolve(__dirname, '../../tsconfig.json') } }, exclude: /node_modules/ }] },
};
module.exports = [
  { ...common, output: { path: path.join(__dirname, 'dist'), filename: 'holocene-timestamp-parser.umd.js', globalObject: 'globalThis', library: { name: 'HoloceneTimestampParser', type: 'umd' } } },
  { ...common, experiments: { outputModule: true }, output: { path: path.join(__dirname, 'dist'), filename: 'holocene-timestamp-parser.es5.js', library: { type: 'module' } } },
];
