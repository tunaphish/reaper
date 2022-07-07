/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/game.ts',
    vendors: ['phaser'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
        include: __dirname + '/src'
      }
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  output: {
    filename: '[name].bundle.js',
  },

  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    open: true,
    liveReload: false,
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'index.html',
        },
        {
          from: 'assets/**/*',
        },
      ],
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
    }),
  ],

};
