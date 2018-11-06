const express = require('express');
const router = express.Router();

// 文件处理
const fs = require('fs');

// 路径处理
const path= require("path");

// 获取图片
const formidable = require('formidable');

// 图像处理
//const gm = require('gm').subClass({imageMagick: true});
//const images = require("images");


// 上传图片至阿里云oos 
const co = require('co');
const OSS = require('ali-oss');
var client = new OSS({
  region: 'oss-cn-qingdao',
  accessKeyId: 'LTAIbS5e0ALBK6fF',
  accessKeySecret: 'IfABu4v5lA8wbvhNNFO7CgXPKWPYWU',
  bucket: '91mitang-img'
});


// 记录数字标记
const model = require("../../model/sign");
const mongoose = require("mongoose");
// add sign
model.find({name: 'signNum'}, function(err, doc) {
    if (err) {
        console.log(err);
    } else {
        if (doc && doc.length > 0) {

        } else {
            model.create({name: 'signNum'}, function(err, doc){
                if (err) {
                    console.log(err)
                } else {
                    console.log(doc)
                }
            }) 
        }
    }
})



router.get('/', function (req, res, next) {
   
})

router.post('/', function (req, res, next) {
    
    var form = new formidable.IncomingForm();

    // 设置编辑类型
    form.encoding = 'utf-8';

    // 设置文件存储路径
    var uploadpath = './public/images/upload';
    form.uploadDir = uploadpath;

    //var uploadpath = path.resolve(__dirname, '../../public/images/upload');
    //form.uploadDir = uploadpath;

    // 保留后缀
    form.keepExtensions = true;

    // 设置单文件大小限制 10mb
    form.maxFieldsSize = 10 * 1024 * 1024;

    // 设置所以文件的大小总和
    form.maxFields = 1000;  
    
    // 设置上传文件的检验码，可以有两个取值'sha1' or 'md5'
    form.hash = false; 
    
    // 多文件上传
    form.multiples = true; 


    form.parse(req, function(err, fields, files) {

        if (err) {
            sendJson({"msg": "form.parse err"}, res);
        } else {
            
            // 计算 files 长度
            var item;
            var length = 0;
            for (item in files) {
                length++;
            }
            if (length === 0) {
                sendJson({"msg": "files no data"}, res)
                return;
            }

            for (item in files) {
                var file = files[item];

                // 临时文件目录
                var oldpath = path.normalize(file.path);

                // 获取扩展名
                var filename = file.name;
                var extname = filename.lastIndexOf('.') >= 0
                                ? filename.slice(filename.lastIndexOf('.') - filename.length)
                                : '';
                
                var type = file.type;
                if (extname === '' && type.indexOf('/') >= 0) { // 文件名没有扩展名时候，则从文件类型中取扩展名
                    extname = '.' + type.split('/')[1];
                }

                // 构建将要存储的文件的路径
                var t = new Date().getTime();
                var ran = Math.random().toString().slice(2);
                var newfilename = t + ran + extname;
                var newpath = uploadpath + '/' + newfilename;

                // 将临时文件保存为正式的文件
                fs.rename(oldpath, newpath, function (err) {
                    var result = '';

                    if (err) {
                        console.log('fs.rename err');
                        result = 'save error1';

                        res.status(200).send(result);
                    } else {
                        // 拼接图片url地址
                       // result = 'https://www.91mitang.com/images/upload/' + newfilename + '#https://www.91mitang.com/images/upload/small/' + newfilename;

                        /*gm(newpath)
                        .resize(null, 144)
                        .noProfile() // 加这个会更小
                        .write(uploadpath + '/small/' + newfilename, function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('ok')
                            }
                        });*/ 
 
                        /*images(newpath)                      
                        .resize(null,144)                                                     
                        .save(uploadpath + '/small/' + newfilename, {              
                            quality : 80                    
                        });*/
                        

                        model.findOne({name: 'signNum'}, (err, doc) => {
                            if (err) {
                                console.log(err);
                            } else {
                                var num = doc.num;

                                var localFile = './' + newpath;  
                                co(function* () {
                                    var key;
                                    key = 'picture/upload' + num + '/' + newfilename;
                                    var pre = 'picture/upload' + num;

                                    var results = yield client.list({
                                        prefix: pre
                                    });
                                    if (results.objects && results.objects.length > 499) {
                                        model.update({name: 'signNum'}, {$inc: {num: 1}}, function(err, doc2) {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                console.log('add 1' + doc2)
                                            }
                                        })
                                    }    

                                    var result0 = yield client.put(key, localFile);
                                    result = 'http://91mitang-img.oss-cn-qingdao.aliyuncs.com/' + result0.name;

                                    // 上传之后删除本地文件
                                    fs.unlinkSync(localFile);
                                    res.status(200).send(result);
                                }).catch(function (err) {
                                    // 上传之后删除本地文件
                                    fs.unlinkSync(localFile);
                                    res.status(200).send('save error2');
                                    console.log(err);
                                });
                                
                            }
                        })

                    }
                }); 
            }
        }
    });
})


function sendJson(doc, res) {
    res.type('json').status(200).json(doc)
}

module.exports = router;
