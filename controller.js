// 控制器, 负责控制服务器端的业务逻辑
// 导入模块
var fs = require('fs');
var path = require('path');
var url = require('url');
// 引入第三方模块 formidable 表单处理
var formidable = require('formidable');
// 封装的model模块
var model = require('./model.js');

// 将导出的对象赋值给一个全局变量
var controller = module.exports;

// 1 显示首页
controller.showHeroList = function (req, res) {
    res.render('/views/heroList.html');
}
// 2 显示添加英雄界面
controller.showHeroAdd = function (req, res) {
    res.render('/views/heroAdd.html');
}

// 3 添加英雄到数据库
controller.addHero = function (req, res) {
    // 添加英雄
    // 1.创建一个解析对象
    var form = new formidable.IncomingForm();
    //1.1 设置文件提交的目录,默认会提交到系统根磁盘临时文件夹，设置之后就会将图片提交到指定的文件目录
    form.uploadDir = './public/images';
    //1.2 设置保留文件拓展名  默认会省略文件拓展名
    form.keepExtensions = true;
    /**
     * 第一个参数：请求对象
     * 第二个参数：回调函数 解析完成时会调用
     *      * err:解析出错
     *      * fields 普通文本数据对象
     *      * files 文件详细信息
     */
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        /**修改文件路径
         * 第一个参数：原始的文件路径
         * 第二个参数： 要修改的文件路径
         * 第三个参数 ：修改完成的回调
         */
        var oldPath = path.join(__dirname, files.icon.path);
        var newPath = path.join(__dirname, form.uploadDir, files.icon.name);

        fs.rename(oldPath, newPath, function () {
            if (err) {
                throw err;
            }

            // 新建一个对象,保存添加的英雄数据
            var obj = {};
            // 此时没有读取json数据,无法得到json数据里heros的长度,交由后面专门处理json数据的模块处理
            //  obj.id = jsonObj.heros.length + 1;
            obj.name = fields.name;
            obj.gender = fields.gender;
            obj.icon = path.join('/', form.uploadDir, files.icon.name);

            // 添加数据的函数,封装成一个独立操作json数据的模块
            model.appendJsonData(obj, function (err) {
                if (err) {
                    // 响应返回(失败)
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_message: err.message
                    }));
                }
                // 响应返回(成功)
                res.end(JSON.stringify({
                    err_code: 0,
                    err_mesage: null
                }));
            })
            /*
                // 读取json文件
                fs.readFile('./hero.json', 'utf-8', function (err, jsonData) {
                    if (err) {
                        //end方法只能响应字符串和二进制，如果是json对象则需要转成字符串
                        res.end(JSON.stringify({
                            err_code: 500,
                            err_message: err.message
                        }));
                    }

                    // 将读取的json字符串装换成对象
                    var jsonObj = JSON.parse(jsonData);

                    // 新建一个对象,保存添加的英雄数据
                    var obj = {};
                    obj.id = jsonObj.heros.length + 1;
                    obj.name = fields.name;
                    obj.gender = fields.gender;
                    obj.icon = path.join('/', form.uploadDir, files.icon.name);

                    // 追加到json对象中
                    jsonObj.heros.push(obj);

                    //2.4 将json对象转成json字符串
                    //第一个参数：要转的sjon对象  第二个参数：替换函数通常为null 第三个参数：指定缩进
                    var jsonStr = JSON.stringify(jsonObj, null, '  ');
                    //2.5 将json字符串写入文件
                    //第一个参数：文件路径 第二个参数：要写入的数据 第三个写入完成的回调
                    fs.writeFile('./hero.json', jsonStr, function (err) {
                        if (err) {
                            res.end(JSON.stringify({
                                err_code: 500,
                                err_message: err.message
                            }));
                        }
                        //3响应返回处理结果
                        res.end(JSON.stringify({
                            err_code: 0,
                            err_mesage: null
                        }));
                    })

                })
            */
        });
    });
}

// 4 显示英雄详情页面 
controller.showHeroInfo = function (req, res) {
    res.render('/views/heroInfo.html');
}

// 5 显示编辑英雄页面 
controller.showHeroEdit = function (req, res) {
    res.render('/views/heroEdit.html');
}

// 6 编辑修改英雄提交到数据库(json文件) 
controller.modifyHero = function (req, res) {
    /**
     * 1.获取用户提交的修改内容
     * 2.解析内容
     * 3.根据英雄id获取具体英雄信息
     * 4.将具体英雄的信息修改为用户提交的内容
     * 5.重写入json数据文件中
     * 6.返回状态到编辑英雄界面
     * 7.判断状态,跳转页面
     */
    // 1.创建一个解析对象
    var form = new formidable.IncomingForm();
    //1.1 设置文件提交的目录,默认会提交到系统根磁盘临时文件夹，设置之后就会将图片提交到指定的文件目录
    form.uploadDir = './public/images';
    //1.2 设置保留文件拓展名  默认会省略文件拓展名
    form.keepExtensions = true;

    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        /**修改文件路径
         * 第一个参数：原始的文件路径
         * 第二个参数： 要修改的文件路径
         * 第三个参数 ：修改完成的回调
         */
        var oldPath = path.join(__dirname, files.icon.path);
        var newPath = path.join(__dirname, form.uploadDir, files.icon.name);

        fs.rename(oldPath, newPath, function () {
            if (err) {
                throw err;
            }

            // console.log(files.icon);
            // 新建一个对象,保存添加的英雄数据
            var obj = {};
             obj.id = +fields.id;
            obj.name = fields.name;
            obj.gender = fields.gender;
            if(files.icon.name){
                obj.icon = path.join('/', form.uploadDir, files.icon.name);
            } else {
                obj.icon = fields.origin_icon;
            }
            

            // console.log(obj);

            // 修改数据的函数,封装成一个独立操作json数据的模块
            model.modifyJsonData(obj, function (err) {
                if (err) {
                    // 响应返回(失败)
                    res.end(JSON.stringify({
                        err_code: 500,
                        err_message: err.message
                    }));
                }
                // 响应返回(成功)
                res.end(JSON.stringify({
                    err_code: 0,
                    err_mesage: null
                }));
            });
        });
    });
}

// 7 删除英雄 
controller.deleteHero = function (req, res) {
    // var reqUrl = url.parse(req.url,true);
    var heroId = req.query.id;
    model.deleteJsonData(heroId,function(err){
        if(err){
            //告诉客户端删除失败
            res.end(JSON.stringify({
                err_code: 500,
                err_message: err.message
            }));
        }
        //告诉客户端删除成功，用户首页要刷新
        //刷新首页既可以在客户端做也可以在服务端做
        //客户端：window.location.href = '/'
        //服务端：重新渲染首页
        req.query = {};
        res.render('./views/heroList.html');
        // console.log('success');
    });
}

// 处理第三方模块的链接请求
controller.showStatic = function (req, res) {
    var url = decodeURI(req.url);
    fs.readFile(path.join(__dirname, url), function (err, data) {
        if (err) {
            res.end('file not found' + url);
        }
        res.end(data)
    });
}