// 导入模块
var http = require('http');
// 路由模块
var router = require('./router.js');

// 创建服务器
var server = http.createServer();

// 监听客户端请求事件 ,端口
server.on('request',function(req,res){
    // 调用路由模块
    router(req,res);
}).listen(3000,function(err){
    console.log('服务器开启成功');
});

/*
    // 渲染函数二次封装
    function addRenderFunction(res){
        res.render = function(htmlUrl){
            fs.readFile(path.join(__dirname,htmlUrl),'utf-8',function(err,htmlData){
                if(err){
                return res.end('template not found'+'heroList.html');
                }
                fs.readFile(path.join(__dirname,'hero.json'),'utf-8',function(err,jsonData){
                    if(err){
                        //如果没有json数据，则直接返回html模板
                        //业务逻辑：有一些html模板不需要模板引擎渲染
                    return res.end(htmlData);
                    }
                    // 将json字符串转换成对象
                    var jsonObj = JSON.parse(jsonData);
                    // 调用模板方法
                    var htmlStr = art_template.compile(htmlData)(jsonObj);
                    // 将生成的html字符串返回
                    res.end(htmlStr);
                });
            })
        }
    }
*/
// 渲染函数首次封装
/* function addRenderFunction(htmlUrl,res){
        fs.readFile(path.join(__dirname,htmlUrl),'utf-8',function(err,htmlData){
            if(err){
                res.end('template not found'+'heroList.html');
            }
            fs.readFile(path.join(__dirname,'hero.json'),'utf-8',function(err,jsonData){
                if(err){
                res.end('template not found'+'hero.json');
                }
                var jsonObj = JSON.parse(jsonData);

                var htmlStr = art_template.compile(htmlData)(jsonObj);

                res.end(htmlStr);
            });
        })
    }
    */