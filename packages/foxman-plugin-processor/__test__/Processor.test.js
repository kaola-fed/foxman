const Processor = require('../lib/Processor')
const path = require('path');
const co = require('co');

test('stackTop', () => {
    expect(Processor.stackTop([1])).toBe(1)
});

test('isPathMatched', () => {
    expect(Processor.isPathMatched(
        {publicPath: '/src/css/:css.css', reqPath: '/src/css/1.css'}
    )).toBe(!!1)
});

test('reqUrl2FilePath', () => {
    expect(Processor.reqUrl2FilePath('/a/b/c')).toBe(path.sep + 'a' + path.sep + 'b' + path.sep +  'c');
});

test('getSemiFinished', () => {
    const file = Processor.getSemiFinished({ 
        pipeline: [
            {
                toSource: (reqPath) => {
                    return reqPath;
                }
            }
        ], 
        base: __dirname, 
        reqPath: '/a/b' }).slice(-1)[0];
    expect(file).toBe(path.join(__dirname, 'a', 'b'));
});

test('getSemiFinished2', () => {
    const file = Processor.getSemiFinished({ 
        pipeline: [
            {
                toSource: (reqPath) => {
                    return reqPath + '/c';
                }
            }
        ], 
        base: __dirname, 
        reqPath: '/a/b' }).slice(-1)[0];
    expect(file).toBe(path.join(__dirname, 'a', 'b', 'c'));
});


test('getSemiFinished3', () => {
    const file = Processor.getSemiFinished({ 
        pipeline: [
            {
                toSource: (reqPath) => {
                    return reqPath.replace(/css/g, 'mcss');
                }
            }
        ], 
        base: __dirname, 
        reqPath: '/css/b' }).slice(-1)[0];
    expect(file).toBe(path.join(__dirname, 'mcss', 'b'));
});


test('workflow', (done) => {
    const helloWorld = 'hello world';
    return co(Processor.workflow({
        raw: helloWorld,
        processdFilenameStack: ['1.css', '1.mcss'],
        reqPath: '1.css',
        pipeline: [
            {
                handler: function*({
                    raw,
                    filename
                }) {
                    return {
                        content: raw,
                    }
                }
            }
        ],
        reloaderService: {
            register: () => {
                
            }
        }
    })).then((content) => {
        expect(content).toBe(helloWorld);
        done();
    }).catch(e => done);
});

test('workflow2', (done) => {
    const helloWorld = 'hello world';
    return co(Processor.workflow({
        raw: helloWorld,
        processdFilenameStack: ['1.css', '1.mcss'],
        reqPath: '1.css',
        pipeline: [
            {
                handler: function*({
                    raw,
                    filename
                }) {
                    return {
                        content: raw.replace(/hello /, ''),
                    }
                }
            }
        ],
        reloaderService: {
            register: () => {
                
            }
        }
    })).then((content) => {
        expect(content).toBe('world');
        done();
    }).catch(e => done);
});