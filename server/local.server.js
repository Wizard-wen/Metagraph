/**
 * @author wizard
 * @date 2021/11:26
 * @description 打包后dist测试
 */

const express = require('express');
const path = require('path');
const os = require('os');

// 设定一个局域网的默认值
let localWlanHost = 'localhost';
// 获取局域网地址
try {
  // networkInterfaces这个方法详见：http://nodejs.cn/api/os.html#os_os_networkinterfaces
  const networkInterfaces = os.networkInterfaces();
  for (let dev in networkInterfaces) {
    networkInterfaces[dev].forEach((details, alias) => {
      // 寻找IPv4协议族，并且地址不是本地地址或者回环地址的地址即可。
      if (details.family === 'IPv4' && details.address !== '127.0.0.1' && !details.internal) {
        localWlanHost = details.address;
      }
    });
  }
} catch (error) {
  console.log(error);
  localWlanHost = 'localhost';
}

// 创建服务器
let app = express();

// 托管静态资源
/*
(1)如果请求路径为/ , express会自动读取www下面index.html响应返回
(2)如果请求路径是以www中文件夹开头，express会自动根据url拼接路径返回
*/
app.use(express.static(path.resolve(__dirname, '../dist')));

// 开启服务器
app.listen(9311,'0.0.0.0', () => {
  console.log(`服务器开启成功，地址http://localhost:9311`);
  if(localWlanHost !== 'localhost'){
    console.log(`局域网地址http://${localWlanHost}:9311`)
  }
});
