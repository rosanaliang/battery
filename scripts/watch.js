/* eslint-env node */

const { execSync } = require('child_process');
const path = require('path');
const Watchpack = require('watchpack');
const fs = require('fs-extra');

// Get absolute paths of all directories under packages/*
function getFiles(dir) {
  return fs
    .readdirSync(dir)
    .map(file => path.resolve(dir, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isFile());
}

function getDirectories(dir) {
  return fs
    .readdirSync(dir)
    .map(file => path.resolve(dir, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}


const CONFIG_SRC = path.resolve(__dirname, '../config');

const BUILD_CMD = `NODE_ENV=development babel-node ${path.resolve(__dirname, './build.js')}`;

var wp = new Watchpack({
  aggregateTimeout: 1000,
  poll: true,
  ignored: /node_modules/,
});

wp.watch(getFiles(CONFIG_SRC),getDirectories(CONFIG_SRC),Date.now() - 10000);



wp.on('aggregated', function(changes) {
  execSync(`${BUILD_CMD} ${changes.join(' ')}`, {stdio: [0, 1, 2]});
});