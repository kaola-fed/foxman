const JSON5 = require('json5');

function parseJSON(jsonStr) {
    return JSON5.parse(jsonStr);
}

function stringifyJSON(json) {
    return JSON5.stringify(json);
}

exports.parse = parseJSON;

exports.stringify = stringifyJSON;
