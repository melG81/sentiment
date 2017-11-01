module.exports = {
  // Define entry point
  entry: './components/app.js',
  // Define output point
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js'
  },
  // Sass loaders
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    }]
  }
}