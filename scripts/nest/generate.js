const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');

const type = process.argv[2];
const name = process.argv[3];

function resolveAppTsConfig() {
  const tsconfigPath = path.resolve(ROOT, 'apps', name, 'tsconfig.app.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

  if (tsconfig?.compilerOptions?.outDir) {
    delete tsconfig.compilerOptions.outDir;
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

function resolveLibTsConfig() {
  return;
}

function generate() {
  if (!type) {
    throw new Error('type(app or library) required');
  }

  if (!name) {
    throw new Error(`${type} name required`);
  }

  execSync(`pnpx @nestjs/cli g ${type} ${name}`, { stdio: 'inherit' });

  switch (type) {
    case 'app':
      resolveAppTsConfig();
      return;

    case 'library':
      resolveLibTsConfig();
      return;
  }
}

generate();
