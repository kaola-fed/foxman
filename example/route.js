module.exports = [
  {
    method: 'GET', url: '/index.html', sync: false, filePath: 'foo.bar'
  },{
    method: 'GET', url: '/index2.html', sync: true, filePath: 'index'
  },{
    method: 'GET', url: '/home/:id', sync: true, filePath: 'page/4pl/expenseTemplate/list'
  }, {
    method: 'GET', url: '/wxConfig.html', sync: true, filePath: 'page/wxConfig'
  }
];