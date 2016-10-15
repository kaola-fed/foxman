'use strict';
const welcome = [
    '*******   ********   **   **         *     *             *        *         *',
    '*         *      *     * *          * *   * *           * *       * *       *',
    '*******   *      *      *          *   * *   *         *   *      *   *     *',
    '*         *      *     * *        *     *     *       * * * *     *     *   *',
    '*         *      *    *   *      *             *     *       *    *       * *',
    '*         ********   *     *    *               *   *         *   *         *'
].join('\n');
console.log(welcome);
require('babel-polyfill');
module.exports = (process.env.NODE_ENV === 'development')? require('./src/index.js'): require('./dist/index.js');