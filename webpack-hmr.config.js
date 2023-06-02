const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = (options, webpack) => {
  // remove ForkTsCheckerWebpackPlugin
  const plugins = options.plugins.filter((plugin) => {
    return plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin';
  });

  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'swc-loader',
          exclude: /node_modules/,
          // todo: fix swc-loader compatible
          // options: {
          //   getCustomTransformers: (program) => ({
          //     before: [require('@nestjs/swagger/plugin').before({}, program)],
          //   }),
          // },
        },
      ],
    },
    plugins: [
      ...plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false }),
    ],
    mode: 'development',
  };
};
