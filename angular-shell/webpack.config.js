const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const { AngularWebpackPlugin } = require('@ngtools/webpack')
const linkerPlugin = require('@angular/compiler-cli/linker/babel')

module.exports = {
  mode: 'development',
  cache: false,
  entry: ['./src/styles.css', './src/main.ts'],
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:4200/',
    clean: true,
  },
  module: {
    rules: [
      // Our source code: AOT compiled by @ngtools/webpack
      {
        test: /\.[cm]?ts$/,
        use: [{ loader: '@ngtools/webpack' }],
        exclude: /node_modules/,
      },
      // Angular library files: partially compiled, need the Angular Linker
      {
        test: /\.[cm]?js$/,
        include: /node_modules[\\/]@angular/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [linkerPlugin.default],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new AngularWebpackPlugin({
      tsconfig: './tsconfig.app.json',
      jitMode: false,
    }),
    new ModuleFederationPlugin({
      name: 'shell',
      shared: {},
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    port: 4200,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
}
