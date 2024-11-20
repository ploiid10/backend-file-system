const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.js', // Replace with your entry point
  target: 'node',
  externals: [nodeExternals()], // Exclude node_modules
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
};
