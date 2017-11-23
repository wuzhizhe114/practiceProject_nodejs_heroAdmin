// 引入模块
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// 第三方模块 art-template
var art_template = require('art-template');

// 创建服务器
var server = http.createServer();

// 监听客户端请求事件 回调函数(参数1:请求对象,参数2:响应对象)
server.on('request',function(req,res){
    var location = req.url;
    var method = req.method;
    console.log(location);
    if(location=='/' && method =='GET'){
        fs.readFile('./views/heroList.html','utf-8',function(err,htmlData){
            if(err){
                res.end('template not found'+'heroList.html');
            }
            fs.readFile('./hero.json','utf-8',function(err,jsonData){
                if(err){
                    res.end('jsonData not found'+'hero.json');
                }
                // 将json字符串转换成对象
                var jsonObj = JSON.parse(jsonData);
                // 调用第三方 模板方法 生成html字符串
                var htmlStr = art_template.compile(htmlData)(jsonObj)
                // 响应返回给客户端
                res.end(htmlStr);
            });
        });
    } else if(location.indexOf('/node_modules')==0 || location.indexOf('/public')==0) {
        fs.readFile(path.join(__dirname,location),function(err,data){
            if(err){
                res.end('url not found '+location);
            }
            res.end(data);
        });
    }
})
// 监听端口号
.listen(3001,function(err){
    console.log('服务器开启成功');
});