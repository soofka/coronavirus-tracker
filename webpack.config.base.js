const path = require('path');
const NodeJsonMinify = require('node-json-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SimpleSwWebpackPlugin = require('./src/simple-sw-webpack-plugin.js');

module.exports = {
  entry: './src/app/index.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      commons: path.resolve(__dirname, 'src/app/commons/'),
      components: path.resolve(__dirname, 'src/app/components/'),
    },
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js?x$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-react-jsx", {
                "pragma": "h",
                "pragmaFrag": "Fragment",
              }],
              // "@babel/plugin-syntax-dynamic-import",
            ],
          },
        },
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
      assets: [
        'index.html',
        'assets/virus.webp',
        'assets/populations.json',
        'assets/virus-tests.json',
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
