const merge = require('webpack-merge');
const base = require('./webpack.config.base.js');

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ClosureWebpackPlugin = require('closure-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SimpleSwWebpackPlugin = require('./src/simple-sw-webpack-plugin.js');

module.exports = merge(base, {
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },
  plugins: [
    new HtmlWebpackInlineSourcePlugin(),
    new FaviconsWebpackPlugin({
      logo: './static/images/virus.png',
      favicons: {
        appName: 'Coronavirus Tracker',
        appDescription: 'Coronavirus Tracker',
        developerName: 'soofka',
        developerURL: 'https://soofka.pl',
        background: '#111',
        theme_color: '#98d463',
        start_url: '/',
      },
    }),
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
});
