const { resolve } = require('path');
const { build } = require('esbuild');
const glob = require('glob');

const buildPath = resolve(__dirname, 'build');

const entryPoints = glob.sync('./client/**/*.ts').concat(glob.sync('./server/**/*.ts'));

build({
  entryPoints: entryPoints,
  outdir: resolve(buildPath),
  bundle: true,
  minify: true,
  platform: 'browser',
  target: 'es2020',
  logLevel: 'info',
}).catch(() => process.exit(1));
