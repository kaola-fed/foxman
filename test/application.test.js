'use strict';
require('babel-polyfill');
const Application = require('../dist/application/index').default;
const WatcherPlugin = require('../dist/plugins/watcher/index').default;

class PluginA{
	constructor(){
		this.a = "nihao";
	}
	init( watcherPlugin ){
		console.log(watcherPlugin);
	}
}

const app = Application();
app.use( new WatcherPlugin( {
    root:'./'
} ));
app.use( new PluginA() );
app.run();