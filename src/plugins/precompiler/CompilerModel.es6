class CompilerModel {
    constructor(options) {
        Object.assign(this, options);
    }
    /**
     * @param  {} watchMap
     */
    setWatchMap(watchMap) {
        this.watchMap = watchMap;
        return this;
    }
    /**
     * @param  {} handler
     */
    setHandler(handler) {
        this.handler = handler;
        return this;
    }
    /**
     * @param  {} sourcePattern
     */
    setSourcePattern(sourcePattern) {
        this.sourcePattern = sourcePattern;
        return this;
    }
    /**
     * @param  {} ignore
     */
    setIgnore(ignore) {
        this.ignore = ignore;
        return this;
    }
    /**
     * @param  {} relative
     */
    setRelative(relative) {
        this.relative = relative;
        return this;
    }
    /**
     * @param  {} name
     */
    setTaskName(name) {
        this.taskName = name;
        return this;
    }
}

export default CompilerModel;