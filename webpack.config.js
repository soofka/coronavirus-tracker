const path = require('path');
const NodeJsonMinify = require('node-json-minify');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ClosureWebpackPlugin = require('closure-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SimpleSwWebpackPlugin = require('./src/simple-sw-webpack-plugin.js');

const title = 'Coronavirus Tracker';

module.exports = {
  entry: './src/app/index.jsx',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
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
    new ImageminWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title,
      inlineSource: '.(js|css)$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, 'static', 'images', 'virus.png'),
      favicons: {
        appName: title,
        appDescription: title,
        developerName: 'Jakub Sowiński <pansoofka@gmail.com> (https://soofka.pl)',
        developerURL: 'https://soofka.pl',
        background: '#111',
        theme_color: '#98d463',
        start_url: '/',
      },
    }),
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsWebpackPlugin(),
    new SimpleSwWebpackPlugin({
      filter: '.(html|json)$',
    }),
    new CompressionWebpackPlugin(),
  ],
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    // },
    // concatenateModules: false,
    minimizer: [
      // new ClosureWebpackPlugin({
      //   platform: 'javascript',
      //   // mode: 'AGGRESSIVE_BUNDLE',
      // }, {
      //   // compilation_level: 'ADVANCED',
      //   rewrite_polyfills: false,
      // }),
      new TerserWebpackPlugin({
        terserOptions: {
          // ecma: 6,
          keep_classnames: false,
          keep_fnames: false,
          module: true,
          toplevel: true,
          mangle: {
            keep_classnames: false,
            keep_fnames: false,
            module: true,
            toplevel: true,
          },
          output: {
            // ecma: 5,
            beautify: false,
          },
        },
      }),
    ],
  },
  mode: 'production',
};
