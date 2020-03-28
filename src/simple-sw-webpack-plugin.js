const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');
const terser = require('terser');

const defaultOptions = {
  source: './src/service-worker.js',
  target: 'service-worker.js',
  filter: undefined,
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
        const assets = `[${
          Array.from(compilation.getStats().compilation.assetsInfo.keys())
            .filter(this.options.filter
              ? (asset) => new RegExp(this.options.filter).test(asset)
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
              let fileContent = data.toString().replace(/%VERSION%/gi, version).replace(/\'%ASSETS%\'/gi, assets);

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
