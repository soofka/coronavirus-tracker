const path = require('path');
const NodeJsonMinify = require('node-json-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SimpleSwWebpackPlugin = require('./src/simple-sw-webpack-plugin');

const { getAbsoluteImportMappings } = require('./src/webpack-absolute-imports');

module.exports = {
  entry: './src/app/index.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    alias: getAbsoluteImportMappings('src/app'),
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js?x$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './static/**/*',
      to: 'assets',
      flatten: true,
      transform: (content, path) =>
        new RegExp('.json$').test(path)
          ? NodeJsonMinify(content.toString())
          : content
      ,
    }]),
    new SimpleSwWebpackPlugin({
      defaultAssets: [
        'index.html',
        'assets/virus.webp',
        'assets/en_EN.json',
      ],
      staticAssets: [
        'assets/pl_PL.json',
      ],
      includeEmittedAssets: false,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
    }),
    new MiniCssExtractPlugin(),
  ],
  mode: 'development',
};
