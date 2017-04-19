const path = require('path');

exports.getTemplatePattern = getTemplatePattern;
exports.getSyncDataPattern = files;
exports.getResourcesPattern = getResourcesPattern;

function joinPattern({ root, extension }) {
    return path.join(root, '**', '*.' + extension);
}

function files(root) {
    return ['css', 'js', 'html'].map(extension =>
        joinPattern({ root, extension })
    );
}

function getTemplatePattern({ extension, viewRoot, templatePaths }) {
    if (!Array.isArray(templatePaths)) {
        templatePaths = Object.keys(templatePaths).map(
            key => templatePaths[key]
        );
    }

    return [...templatePaths, viewRoot].map(root =>
        joinPattern({ root, extension })
    );
}

function getResourcesPattern(statics) {
    return statics.reduce((total, current) => {
        return [...total, ...files(current.dir)];
    }, []);
}
