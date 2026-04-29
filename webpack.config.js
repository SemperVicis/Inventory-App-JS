const path = require("path")

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production"

    return {
        mode: isProduction ? "production" : "development",
        entry: "./src/js/app.js",
        output: {
            path: path.resolve(__dirname, "public/build/webpack"),
            filename: "bundle.js",
            clean: true,
        },
        devtool: isProduction ? false : "source-map",
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            }],
        },
        optimization: {
            minimize: isProduction,
        },
    }
}
