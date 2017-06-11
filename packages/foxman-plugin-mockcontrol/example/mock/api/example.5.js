module.exports = function * (data) {
    const fn = this.request.query.callback || 'callback';

    const name = this.request.query.name;
    
    if (name) {
        data = Object.assign(data, {name});
    }

    yield new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });


    this.body = `${fn}(${JSON.stringify(data)})`;
};