var path = require("path");
var webpack = require("webpack");

var dest = './public'; // 出力先ディレクトリ
var src = './src';  // ソースディレクトリ

module.exports = {
  // 出力先の指定
  dest: dest,

  // jsのビルド設定
  js: {
    src: src + '/js/**',
    dest: dest + '/js',
    uglify: false
  },

  // webpackの設定
  webpack: {
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        root: [path.join(__dirname, "../bower_components")]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
  },

  // 単純なコピー
  copy: {
      src: [
        src + '/static/index.html',
        src + '/static/main.css'
      ],
      dest: dest
  }
}
