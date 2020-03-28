const path = require('path');
const NodeJsonMinify = require('node-json-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  entry: './src/app/index.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
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
      title: 'Coronavirus Tracker',
      inlineSource: '.(js|css)$',
    }),
    new MiniCssExtractPlugin(),
  ],
  mode: 'development',
};
