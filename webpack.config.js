const path = require("path");

module.exports = {
  entry: "./src/popupIndex.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "popup.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,  // ✅ Enables CSS imports
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  target: "web",
  devtool: false,  // ✅ Corrected to Webpack 5-compatible format
};
