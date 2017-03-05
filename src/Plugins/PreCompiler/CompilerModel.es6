class CompilerModel {
    constructor(options) {
        Object.assign(this, options);
    }
    /**
     * @param  {string} watchMap
     */
    setWatchMap(watchMap) {
        this.watchMap = watchMap;
        return this;
    }
    /**
     * @param  {function} handler
     */
    setHandler(handler) {
        this.handler = handler;
        return this;
    }
    /**
     * @param  {string} sourcePattern
     */
    setSourcePattern(sourcePattern) {
        this.sourcePattern = sourcePattern;
        return this;
    }
    /**
     * @param  {string} relative
     */
    setRelative(relative) {
        this.relative = relative;
        return this;
    }
    /**
     * @param  {string} name
     */
    setTaskName(name) {
        this.taskName = name;
        return this;
    }
}

export default CompilerModel;