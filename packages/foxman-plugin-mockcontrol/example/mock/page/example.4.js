module.exports = function * (data) {
    
    yield new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });

    return data;
};