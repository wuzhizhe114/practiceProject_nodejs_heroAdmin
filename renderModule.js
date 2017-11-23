// 引入模块
var fs = require('fs');
var art_template = require('art-template');
var path = require('path');
var url = require('url');

// 模型模块
var model = require('./model.js');


// 导出数据渲染模块
module.exports = function (req, res) {
    
    res.render = function (htmlUrl) {
        fs.readFile(path.join(__dirname, htmlUrl), 'utf-8', function (err, htmlData) {
            if (err) {
               
                return res.end('template not found' + htmlUrl);
            }
            
            // var reqUrl = url.parse(req.url, true);
            
            var heroId = req.query.id;
            console.log(heroId);
            // 模型模块 查询jsonObj 方法
            model.selectJsonData(heroId,function (err, jsonObj) {
                if (err) {
                    //如果没有json数据，则直接返回html模板
                    //业务逻辑：有一些html模板不需要模板引擎渲染
                    
                    return res.end(htmlData);
                }
                // 调用模板方法
                var htmlStr = art_template.compile(htmlData)(jsonObj);
               
                // 将生成的html字符串返回
                res.end(htmlStr);

            });
        })
    }
}