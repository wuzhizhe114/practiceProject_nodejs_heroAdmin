/*
 * @Author: wuzhizhe/chenGuangHui 
 * @Date: 2017-11-21 00:13:33 
 * @Last Modified by: wuzhizhe/chenGuangHui
 * @Last Modified time: 2017-11-23 08:54:10
 */

// 渲染数据模块
var renderModule = require('./renderModule.js');
// 控制器模块
var controller = require('./controller.js');
var urlModule = require('url');

// 路由模块
module.exports = function (req,res){
    var url = req.url;
    var method = req.method;
    // 解析请求地址
    var urlObj = urlModule.parse(url,true);
    
    // 将query对象赋值给请求对象
    req.query = urlObj.query;
    // 调用第二次封装的函数1
    // addRenderFunction(res);
    // 渲染模块方法
    renderModule(req,res);

    if(req.url ==='/' && method === 'GET'){
        // 显示首页
        // 调用第一次封装的函数
        //addRenderFunction('/views/heroList.html',res);

        // 调用第二次封装的函数2 渲染模块的调用
        controller.showHeroList(req,res);
    } else if(url==='/heroAdd' && method ==='GET'){
        // 显示添加英雄页面 控制模块方法
        controller.showHeroAdd(req,res)
    }else if(url==='/heroAdd' && method ==='POST'){
        // 添加英雄到数据库 控制模块方法
        controller.addHero(req,res);
    }else if(url.indexOf('/heroEdit')===0 && method ==='GET'){
        // 显示编辑英雄页面
        controller.showHeroEdit(req,res);
    }else if(url==='/heroEdit' && method ==='POST'){
        // 修改英雄 
        controller.modifyHero(req,res);
    }else if(url.indexOf('/heroInfo')===0){
        // 显示英雄详情
        controller.showHeroInfo(req,res);
    }else if(url.indexOf('/heroDelete')===0){
        // 删除英雄
        controller.deleteHero(req,res);
    }else if ((url.indexOf('/node_modules') === 0) || (url.indexOf('/public') === 0)){
        controller.showStatic(req,res);
    } else {
        res.end('404 not found' + url);
    }
}