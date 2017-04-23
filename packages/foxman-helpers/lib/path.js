const path = require( 'path' );

exports.shorten = function shorten( filepath, relativeWith = process.cwd(), alias = '' ) {
    return alias + path.relative( relativeWith, filepath );
};
