const path = require('path');

module.exports = [{
    mode: 'development',
    entry: {
    popup: './src/popup.ts'
  },
  output: {
    path: path.resolve(__dirname, 'mainPopup'),
    filename: '[name]Bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}];