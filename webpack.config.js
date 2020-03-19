const path = require('path');
const NodeJsonMinify = require('node-json-minify');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ClosureWebpackPlugin = require('closure-webpack-plugin');
// const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const SimpleSwWebpackPlugin = require('./src/sw-webpack-plugin.js');

// @TODO:
// rewrite components like header
// fix warnings from closure-compiler
// MINIFY HTML
// MINIFY JSON

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
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
      from: './static',
      transform: (content, path) =>
        new RegExp('.json$').test(path)
          ? NodeJsonMinify(content.toString())
          : content
      ,
    }]),
    new ImageminWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      minify: true,
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin(),
    new SimpleSwWebpackPlugin({
      filter: '.(js|css)$',
    }),
    new CompressionWebpackPlugin(),
  ],
  optimization: {
    // concatenateModules: false,
    minimizer: [
      // new ClosureWebpackPlugin({
      //   platform: 'javascript',
      //   // mode: 'AGGRESSIVE_BUNDLE',
      // }, {
      //   compilation_level: 'ADVANCED',
      //   rewrite_polyfills: false,
      // }),
      // new TerserWebpackPlugin({
      //   terserOptions: {
      //     // ecma: 6,
      //     keep_classnames: false,
      //     keep_fnames: false,
      //     module: true,
      //     toplevel: true,
      //     mangle: {
      //       keep_classnames: false,
      //       keep_fnames: false,
      //       module: true,
      //       toplevel: true,
      //     },
      //     output: {
      //       // ecma: 5,
      //       beautify: false,
      //     },
      //   },
      // }),
      new OptimizeCssAssetsWebpackPlugin({}),
    ],
  },
  mode: 'production',
};
