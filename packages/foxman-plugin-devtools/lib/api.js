module.exports = () => {
    return function * (next) {
        return yield next;
    };
};
