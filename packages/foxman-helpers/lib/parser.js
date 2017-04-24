const { typeOf } = require('./typer');

function parseJSON(jsonStr) {
    const result = new Function(`return ${jsonStr}`)();

    if (typeOf(result) === 'object') {
        return result;
    }

    return {};
}

exports.parseJSON = parseJSON;
