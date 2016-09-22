#!/usr/bin/env node
'use strict';
const path = require('path');
let config ;

const argv = require('yargs')
    .option('config', {
        alias: 'c' ,
        demand: true ,
        default: 'foxman.config.js' ,
        describe: 'Config file. Options read readme.md' ,
        boolean: 0
    })
    .option('proxy', {
        alias: 'p',
        demand: false,
        default: false,
        describe: `define proxy in foxman.config.js and set the name here`
    })
    .option('update', {
        alias: 'u',
        demand: false,
        default: false,
        describe: 'is update from nei'
    })
    .usage('Usage: foxman [options]')
    .example('foxman -c ./config.json', 'set config file')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright junyu')
    .argv;


var configPath = path.join(process.cwd(), argv.config);

try {
    config = require(configPath);
} catch (err) {
    console.log(`Error:\n ${err}`);
    process.exit(1);
}

Object.assign(config, { argv });
require('../app.js')(config);
