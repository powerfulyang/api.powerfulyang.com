module.exports = (options) => {
  return {
    ...options,
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'swc-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'source-map',
  };
};
