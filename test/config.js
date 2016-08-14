module.exports = {
  public: './static',
  port: '8080',
  hot: true,
  // watch: [require.resolve('./page.ftl'), 'E:\\ftlServer\page.mock'],
  remoteDebug: {
    browser: 'firefox'
  },
  ftl: {
    base: './ftl',
    dataFiles: [__dirname+'/mock/fakeData/index.json'],
    global: {

    }
  },
  mock: [{
    path: '/request',
    method: 'get',
    status: '200',
    header: {

    },
    response: function(req, res) {
      return {
        a: 1,
        B: 2
      }
    }
  }],
  proxy: [{
    path: '/proxy1',
    target: 'http://localhost:3000'
    }
  ]
}