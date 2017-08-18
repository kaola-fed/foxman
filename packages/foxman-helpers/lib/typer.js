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

function isTrue(flag) {
    if (flag === 'true') {
        flag = true;
    } else if (flag === 'false') {
        flag = false;
    } else {
        flag = Number(flag);
    }

    return flag;
}

exports.typeOf = typeOf;
exports.values = values;
exports.ensureArray = ensureArray;
exports.isTrue = isTrue;