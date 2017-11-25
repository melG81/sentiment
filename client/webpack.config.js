// Access built in webpack plugins
const webpack = require('webpack');
// Used for compiling specific files
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// Use to minify css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // Define entry point
  entry: './components/app.js',
  // Define output point
  output: {
    path: __dirname + '/public',
    filename: 'js/bundle.js'
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
    },
    {
      test: /\.scss$/,
      exclude: __dirname + '/components/styles',
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    },
    {
      test: /\.scss$/,
      include: __dirname + '/components/styles',
      use: ExtractTextPlugin.extract(['css-loader','sass-loader'])
    },
    {
      test: /\.hbs$/, 
      loader: "handlebars-loader",
			query: { 
				helperDirs: [
					__dirname + "/src/helpers"
				]
      }
    }
  ]
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },  
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'styles/main.css',
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new webpack.IgnorePlugin(/jsdom/),
  ]
}
