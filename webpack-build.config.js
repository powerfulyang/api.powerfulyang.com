module.exports = (options) => {
  // remove ForkTsCheckerWebpackPlugin
  const plugins = options.plugins.filter((plugin) => {
    return plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin';
  });

  return {
    ...options,
    plugins,
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
