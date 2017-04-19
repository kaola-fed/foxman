function upperCaseFirstLetter(str) {
    return str.replace(/^\b(\w)(\w*)/, function($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });
}

function lowerCaseFirstLetter(str) {
    return str.replace(/^\b(\w)(\w*)/, function($0, $1, $2) {
        return $1.toLowerCase() + $2;
    });
}

function removeHeadBreak(str) {
    return str.replace(/^(\/|\\)/, '');
}

function removeSuffix(str, test) {
    if (test) {
        return str.replace(new RegExp('\.' + test + '$', 'ig'), '');
    }
    return str.replace(/\.[^\.]*$/, '');
}

function jsonPathResolve(url) {
    url = removeSuffix(url) + '.json';

    if (/\.[^\.]*$/.test(url)) {
        return removeHeadBreak(url);
    }
    return url;
}

function appendHeadBreak(str) {
    if (/^[\/\\]/.test(str)) {
        return str;
    }
    return '/' + str;
}

function compressHtml(htmlstr) {
    if (typeof htmlstr !== 'string') {
        return htmlstr;
    }
    return htmlstr
        .replace(/[\r\n]|\s+(?=[<{])/g, '')
        .replace(/[}>]\s+/g, function(value) {
            return value.substr(0, 1);
        });
}

function addDataExt(filePath) {
    if (~filePath.indexOf('.json')) {
        return filePath;
    }
    return filePath + '.json';
}


exports.lowerCaseFirstLetter = lowerCaseFirstLetter;
exports.upperCaseFirstLetter = upperCaseFirstLetter;

exports.jsonPathResolve = jsonPathResolve;

exports.removeHeadBreak = removeHeadBreak;
exports.removeSuffix = removeSuffix;

exports.addDataExt = addDataExt;
exports.appendHeadBreak = appendHeadBreak;

exports.compressHtml = compressHtml;