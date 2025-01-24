module.exports = {
    entry: './src/WeeklyTimeSheet.js',
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            } 
        ]
    }
}
