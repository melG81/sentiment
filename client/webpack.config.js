// Access built in webpack plugins
const webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // Define entry point
  entry: './components/app.js',
  // Define output point
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js'
  },
  // Loaders
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }      
    },{
      test: /\.scss$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new BundleAnalyzerPlugin()
  ]  
}