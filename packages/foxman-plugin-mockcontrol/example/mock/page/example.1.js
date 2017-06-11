module.exports = function (data) {
    let name = this.request.query.name;

    if (name) {
        return Object.assign(data, {
            name
        });
    }
    
    return data;
};