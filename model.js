// 模型模块,处理json数据的增删改查

//内置模块
var fs = require('fs');

// 将导出对象赋值给一个全局变量
var model = module.exports;

// 将json数据路径赋值给一个变量,方便调用
var jsonPath = './hero.json';

// 查询json数据  如果没有添加给module.exports只能在当前文件作用域使用(model的私有方法)
/**
 * @param {heroId}  英雄id 查询具体英雄信息
 * @param {callback}  将读取的err状态或jsonObj数据返回 
 */
function selectJsonData(heroId, callback) {
    fs.readFile(jsonPath, 'utf-8', function (err, data) {

        if (err) {

            callback(err, null);
        }
        // 将读取的json字符串转换成json对象 并返回
        var jsonObj = JSON.parse(data);
        if (heroId) {

            jsonObj = jsonObj.heros[heroId - 1];
        }
        // console.log(jsonObj);
        callback(null, jsonObj);
    });
}

// 添加数据
/**
 * 
 * @param {*} hero 需要添加的英雄对象
 * @param {*} callback 回调,返回添加的处理结果
 */
function appendJsonData(hero, callback) {
    // 调用查询方法,获取json对象
    selectJsonData(null, function (err, jsonObj) {
        if (err) {
            callback(err);
        }

        // 给要添加的英雄对象添加id属性
        hero.id = jsonObj.heros.length + 1;

        // 追加到json对象中
        jsonObj.heros.push(hero);

        //2.4 将json对象转成json字符串
        //第一个参数：要转的sjon对象  第二个参数：替换函数通常为null 第三个参数：指定缩进
        var jsonStr = JSON.stringify(jsonObj, null, '  ');
        //2.5 将json字符串写入文件(保存)

        saveJsonData(jsonStr, function (err) {
            if (err) {
                callback(err);
            }
            callback(err);
        })
    });


}

// 保存数据 如果没有添加给module.exports只能在当前文件作用域使用(model的私有方法)
/**
 * 
 * @param {*} heroStr 要写入的英雄对象 json字符串形式
 * @param {*} callback 写入完成后的回调
 */
function saveJsonData(jsonStr, callback) {
    //第一个参数：文件路径 第二个参数：要写入的数据 第三个写入完成的回调
    fs.writeFile(jsonPath, jsonStr, function (err) {
        if (err) {
            //响应返回处理结果(失败)
            callback(err)
        }
        //响应返回处理结果(成功)
        callback(null);
    })
}

// 修改数据
/**
 * 
 * @param {要修改的英雄对象} hero 
 * @param {修改完成的回调} callback 
 */
function modifyJsonData(hero, callback) {
    selectJsonData(null, function (err, jsonObj) {
        if (err) {
            callback(err);
        }
        // 取出当前英雄的下标值
        var heroIndex = hero.id - 1;
        // 替换掉原位置的英雄数据
        jsonObj.heros.splice(heroIndex, 1, hero);
        // console.log(jsonObj);

        //第一个参数：要转的sjon对象  第二个参数：替换函数通常为null 第三个参数：指定缩进
        var jsonStr = JSON.stringify(jsonObj, null, '  ');

        // 重新写入文件中
        saveJsonData(jsonStr, function (err) {
            callback(err);
        });
    });
}

// 删除数据
/**
 * 
 * @param {Number} hero 要删除的英雄对象
 * @param {Function} callback 删除完成的回调
 */
function deleteJsonData(heroId, callback) {
    selectJsonData(null, function (err, jsonObj) {
        if (err) {
            callback(err);
        }
        // 取出当前英雄的下标值
        var heroIndex = heroId - 1;
        // 删除原位置的英雄数据
        jsonObj.heros.splice(heroIndex, 1);

        // 位于原英雄位置之后的英雄id 要减一
        jsonObj.heros.forEach(element => {
            if(element.id > heroIndex){
                element.id -= 1;
            }
        });
        // console.log(jsonObj.heros);

        //第一个参数：要转的sjon对象  第二个参数：替换函数通常为null 第三个参数：指定缩进
        var jsonStr = JSON.stringify(jsonObj, null, '  ');

        // 重新写入文件中
        saveJsonData(jsonStr, function (err) {
            callback(err);
        });
    });
}

model.selectJsonData = selectJsonData;
model.appendJsonData = appendJsonData;
model.saveJsonData = saveJsonData;
model.modifyJsonData = modifyJsonData;
model.deleteJsonData = deleteJsonData;