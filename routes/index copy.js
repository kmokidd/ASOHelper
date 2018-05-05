var express = require('express');
var router = express.Router();

// sys defined modules
var fs = require('fs');
var path = require('path');

// 3rd party modules
var multer = require('multer');

// self-defined modules
const modParseData = require("../mod/mod-parse-data-d3-splite.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { isShow: false });
});

// API
var uploader = multer({dest: __dirname + '/upload'});
// 上传单个文件 --- uploader.single
router.post('/postData', uploader.single('file'), function(req, res){
  console.log('post data in index.js');

  // 要上传两个字段
  // kw - 关键词
  // file - xls 的 ASO 数据
  if(!req.body.kw || !req.file) {
    res.json({code:-1, message: '输入错误'});
    return;
  }

  // 分析

  const data = {
    keywords: req.body.kw,
    xlsFilePath: ''
  };

  const file = req.file;

  //文件移动的目录文件夹，不存在时创建目标文件夹
  var targetDir = path.join(__dirname, 'upload');
  if (!fs.existsSync(targetDir)) {
      fs.mkdir(targetDir);
  }
  var fileExt = file.originalname.substring(file.originalname.lastIndexOf('.'));
  // //判断文件类型是否允许上传
  if (('.xlsx.xls.numbers').indexOf(fileExt.toLowerCase()) === -1) {
    var err = new Error('此文件类型不允许上传');
    res.json({code:-1, message:'此文件类型不允许上传'});
  }else {
    //以当前时间戳对上传文件进行重命名
    var fileName = new Date().getTime() + fileExt;
    var targetFile = path.join(targetDir, fileName);
    //移动文件
    fs.rename(file.path, targetFile, function (err) {
      if (err) {
          console.info(err);
          res.json({code:-1, message:'操作失败'});
      } else {
          //上传成功，返回文件的相对路径
          var fileUrl = '/upload/' + fileName;
          data.xlsFilePath = targetFile;
          // 分析数据，返回分析结果
          const obj = modParseData(data);
          // 删除文件 
          fs.unlinkSync(targetFile);
          
          res.send({code:0, fileUrl:fileUrl, data: obj});
      }
    });
  }
});

module.exports = router;



// tools
function checkDataStruct(req){

}