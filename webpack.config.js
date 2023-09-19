const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point of your application
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // Injects CSS into the DOM
                    'css-loader',   // Converts CSS into CommonJS
                    'sass-loader'   // Compiles Sass to CSS
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(png|jpe?g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/', // Output directory for images
                        },
                    },
                ],
            },
        ],
    },
};
