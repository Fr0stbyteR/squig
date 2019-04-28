/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

const config = {
    entry: "./src/index.ts",
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        chunkFilename: "js/[chunkhash].js"
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            use: "babel-loader",
            exclude: /node_modules/
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            use: [{
                loader: "file-loader",
                options: {
                    outputPath: "assets/",
                    publicPath: "assets/"
                }
            }]
        }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "/* eslint-disable */",
            raw: true
        })
    ]
};
module.exports = (env, argv) => {
    if (argv.mode === "development") {
        config.devtool = "inline-source-map";
    }
    if (argv.as === "server") {
        config.target = "node";
        config.entry = "./src/server/server.ts";
        config.output.filename = "server" + (argv.mode === "development" ? "" : ".min") + ".js";
    }
    if (argv.as === "client") {
        config.entry = "./src/index.ts";
        config.output.filename = "index" + (argv.mode === "development" ? "" : ".min") + ".js";
    }
    if (argv.as === "admin") {
        config.entry = "./src/admin.ts";
        config.output.filename = "admin" + (argv.mode === "development" ? "" : ".min") + ".js";
    }
    return config;
};
