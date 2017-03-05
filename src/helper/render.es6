// import os from 'os';
// export default ((os.platform() === 'win32') ?
//     require('./freemarker') :
//     require('./fastftl')).default;
export default require('./fastftl').default;