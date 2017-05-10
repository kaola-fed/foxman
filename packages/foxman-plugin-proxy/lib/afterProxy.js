function afterProxy () {
    return function * (next) {
        if (!this.dispatcher) {
            return this.body = this._proxyResponse;
        }

        this.dispatcher.handler = () => this._proxyResponse;
        yield next;
    };
}

module.exports = afterProxy;