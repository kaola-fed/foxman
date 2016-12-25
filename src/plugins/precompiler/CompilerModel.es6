export default class CompilerModel {
	constructor (options) {
		Object.assign(this, options);
	}
	setWatchMap (watchMap) {
		this.watchMap = watchMap;
		return this;
	}
	setHandler (handler) {
		this.handler = handler;
		return this;
	}
	setSourcePattern (sourcePattern) {
		this.sourcePattern = sourcePattern;
		return this;
	}
	setIgnore (ignore) {
		this.ignore = ignore;
		return this;
	}
	setRelative (relative) {
		this.relative = relative;
		return this;
	}
}
