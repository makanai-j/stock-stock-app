import { rules } from './webpack.rules'

import type { Configuration } from 'webpack'

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  output: {
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: {
      index: '.webpack/renderer/main_window/index.html',
    },
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    modules: ['./src', './node_modules'],
  },
}
