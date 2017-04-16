const path = require('path');
const {values, typeOf} = require('@foxman/helpers/lib/util');

exports.template = ({
    extension,
    viewRoot,
    templatePaths
}) => {
    const reduceTemplateDir = ({templatePath, extension}) => {
        return path.join(templatePath, '**', '*.' + extension);
    };

    if (typeOf(templatePaths) !== 'array') {
        templatePaths = values(templatePaths);
    }

    return [
        ...templatePaths,
        viewRoot
    ].map(templatePath =>
        reduceTemplateDir({
            templatePath,
            extension
        })
    );
};

exports.syncData = syncDataRoot => {
    return ['*.css', '*.js', '*.html'].map(
        tail =>path.join(syncDataRoot, '**', tail
    ));
};

exports.resources = statics => {
    return statics.reduce(
        (total, current) => {
            return [
                ...total,
                ...['*.css', '*.js', '*.html'].map(tail =>
                    path.join(current.dir, '**', tail))
            ];
        },
        []
    );
};