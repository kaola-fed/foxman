## 配置 NEI
> NEI 是网易推出的一款接口定义平台

### nei@object(可选)
```javascript
nei: {
    key: "xxxxx"
}
```
将工程的 nei key 填写到 config.nei.key 中即可

**注意：需要在nei中配置工程规范**

## 如何同步远程端的 Mock Data
```bash
$ foxman -u
```

## 运行细节
1. 首次 `foxman -u` 会在 ~/localMock 下创建一个名字为 nei key 的文件夹;
2. Mock Server 响应时，会先读取该目录下的数据作为 Mock Data，再将工程内的 Mock Data 覆盖上来   
```javascript
Mock = Object.assign(localMock, projectMock)
```

## 建议
1. 虽然 Foxman 提供了 Mock 数据两端的支持，但建议每次更新Mock数据永远只更新固定一处（本地 or 远程端）