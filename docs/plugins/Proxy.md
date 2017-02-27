## 如何配置 Proxy

### host@String(必需项)
> 用以发送给测试环境时带在 request 头上，给 nginx 分发用

### service@object(必需项)
> service 的作用是接收到当浏览器的同步请求时，如何转发到远端 JSON url 上
```js
service: {
    local: function (url) {
        return 'http://127.0.0.1:8080/' + url;
    }
    test: function (url) {
        return 'http://10.165.125.195/' + url;
    }
}
```

## 启动
```bash
$ foxman -p test #"test" 为在 config 中配置的远程服务器项
```

## Proxy 实现原理
Foxman 在处理到同步请求时，会将请求根据 service 中规则转发，并在 Request Header 带上 'X-Special-Proxy-Header': 'foxman' 字段。

## Server 端如何实现
拦截请求的 'X-Special-Proxy-Header' 字段，如果为 'foxman' 则将 页面 Model (MVC中的M)转成 JSON 后直接返回。

