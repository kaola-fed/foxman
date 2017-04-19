function typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function values(map = {}) {
    return Object.keys(map).map(k => map[k]);
}

function ensureArray(target) {
    if (Array.isArray(target)) {
        return target;
    }

    return [target];
}

exports.typeOf = typeOf;
exports.values = values;
exports.ensureArray = ensureArray;
