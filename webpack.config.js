const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // target: 'node', // in order to ignore built-in modules like path, fs, etc.
  // externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
