const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');
const terser = require('terser');

const defaultOptions = {
  source: './src/service-worker.js',
  target: 'service-worker.js',
  assets: [],
  includeEmittedAssets: true,
  emittedAssetsRegexp: undefined,
  minify: undefined,
};

class SimpleSwWebpackPlugin {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  apply(compiler) {
    compiler.hooks.shouldEmit.tap(
      'SimpleSwWebpackPlugin',
      (compilation) => {
        const version = uuid();
        let assets = this.options.assets;

        if (this.options.includeEmittedAssets) {
          assets = assets.concat(
            Array.from(compilation.getStats().compilation.assetsInfo.keys()));
        }

        const assetsString = `[${assets
          .filter((asset, index, array) => array.indexOf(asset) === index)
          .filter(this.options.emittedAssetsRegexp
            ? (asset) => new RegExp(this.options.emittedAssetsRegexp).test(asset)
            : (asset) => asset,
          )
          .map((asset) => `"${asset}"`)
          .join(',')
        }]`;

        fs.readFile(
          path.resolve(this.options.source),
          (error, data) => {
            if (error) {
              console.error('Error:', error);
            } else {
              let fileContent = data.toString()
                .replace(/%VERSION%/gi, version)
                .replace(/\'%ASSETS%\'/gi, assetsString);

              if (
                this.options.minify === true
                || (this.options.minify !== false
                  && (compilation.options.mode || compilation.options.optimization.nodeEnv) === 'production'
                )
              ) {
                fileContent = terser.minify(fileContent).code;
              }

              const fileContentBuffer = Buffer.from(fileContent, 'utf-8');

              compilation.emitAsset(
                this.options.target,
                {
                  source: () => fileContentBuffer,
                  size: () => fileContentBuffer.length,
                },
              );
            }
          },
        );
      },
    );
  }
}

module.exports = SimpleSwWebpackPlugin;
