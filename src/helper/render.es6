import os from 'os';
export default ((os.platform() === 'win32') ?
    require('./winRender') :
    require('./macRender')).default;