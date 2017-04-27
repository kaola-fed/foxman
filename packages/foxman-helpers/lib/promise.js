function isPromise(obj) {
    return !!(obj && obj.then);
}

function ensurePromise(result) {
    if (isPromise(result)) {
        return result;
    }
    return Promise.resolve(result);
}

exports.isPromise = isPromise;
exports.ensurePromise = ensurePromise;
