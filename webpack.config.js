const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {

	const production = !!(env && env.production)

	return {
		mode : production ? 'production' : 'development',
		entry : {
			'seeing-music' : ['@babel/polyfill', 'core-js', './src/Main.js'],
		},
		context : __dirname,
		output : {
			path : path.resolve(__dirname, 'build'),
			filename : '[name].js'
		},
		plugins : [
			new webpack.ProvidePlugin({
				fetch : 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
			}),
			new HtmlWebpackPlugin({
				title : 'Seeing Music',
				filename: 'index.html',
				chunks : ['seeing-music'],
				template : './src/template.html',
			}),
			new webpack.DefinePlugin({
				MODE : JSON.stringify(production ? 'production' : 'development')
			})
		],
		resolve : {
			modules : [
				'node_modules',
				path.resolve(__dirname, '.')
			],
		},
		module : {
			rules : [
				{ 
					test : /\.js$/, 
					exclude : /node_modules/, 
					loader : 'babel-loader' 
				},
				{ 
					test : /\.scss$/,
					use : [{
						loader : 'style-loader'
					}, {
						loader : 'css-loader'
					}, {
						loader : 'postcss-loader',
						options : {
							plugins : () => [
								require('autoprefixer')(),
							]
						}
					}, {
						loader : 'sass-loader',
						options : {
							includePaths : [path.resolve(__dirname, 'node_modules')]
						}
					}]
				},
				{ 
					test : /\.(svg|png)$/, 
					exclude : /node_modules/, 
					loader : 'url-loader' 
				},
			]
		},
		devtool : production ? '' : 'source-map'
	}
}
