function isGeneratorDone(obj) {
    return obj && obj.done;
}

function isGenerator(obj) {
    return obj && obj.constructor && obj.constructor.name === 'GeneratorFunction';
}

exports.isGeneratorDone = isGeneratorDone;
exports.isGenerator = isGenerator;
