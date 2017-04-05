import {isPromise, isGeneratorDone} from './util';

function runGenerators(generator) {
    let final, resolve, reject;

    const generatorIterator = () => {
        final = generator.next();

        if (isGeneratorDone(final)) {
            return resolve();
        }

        if (isPromise(final)) {
            return final.value
                .then(() => generatorIterator())
                .catch((err) => {
                    reject(err);
                });
        }

        generatorIterator();
    };

    return new Promise((...args) => {
        [resolve, reject] = args;
        generatorIterator();
    })
}

export default runGenerators;