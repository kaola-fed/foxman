module.exports = function (data) {
    const fn = this.request.query.callback || 'callback';

    const name = this.request.query.name;
    
    if (name) {
        data = Object.assign(data, {name});
    }

    this.body = `${fn}(${JSON.stringify(data)})`;
};