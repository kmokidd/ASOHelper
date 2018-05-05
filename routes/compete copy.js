var express = require('express');
var router = express.Router();

// sys defined modules
var fs = require('fs');
var path = require('path');

// 3rd party modules
var multer = require('multer');
const modAnalyseCompete = require("../mod/mod-analyse-compete.js");

router.get('/', function(req, res, next) {
  res.render('compete', { isShow: false });
});

var uploader = multer({dest: path.resolve(__dirname, '..') + '/compete'});

router.post('/postCompeteData', uploader.array('competitors', 6), function(req, res){
  console.log('post data in compete.js');
  if(!req.files) {
    res.json({code:-1, message: '输入错误'});
    return;
  }

  const fileArr = req.files;
  const fileCount = fileArr.length;

  //文件移动的目录文件夹，不存在时创建目标文件夹
  let targetDir = path.join(path.resolve(__dirname, '..'), 'compete');
  if (!fs.existsSync(targetDir)) {
      fs.mkdir(targetDir);
  }

  let fileExtArr = [];

  let data = {
    fileUrls: [],
    targetUrls: []
  };

  // 检查上传的文件是否合法
  // 必须全部合法才能进行分析
  for(let file of fileArr) {
    let fileExt = file.originalname.substring(file.originalname.lastIndexOf('.'));
    console.log(fileExt);

    if(!isTypeChecked(fileExt)) {
      let err = new Error('此文件类型不允许上传');
      res.json({code:-1, message:'此文件类型不允许上传'});
      break;
    }
  }

  let countSucc = 1;
  fileArr.forEach(file => {
    //以当前时间戳对上传文件进行重命名
    let fileName = `${new Date().getTime()}_${file.originalname}`;
    let targetFileUrl = path.join(targetDir, fileName);
    //移动文件
    fs.rename(file.path, targetFileUrl, function (err) {
      if (err) {
        console.info(err);
        res.json({code:-1, message:'操作失败'});
      } else {
        //上传成功，返回文件的相对路径
        data.fileUrls.push(`/compete/${fileName}`);
        data.targetUrls.push(targetFileUrl);
        
        if(countSucc === fileCount) { // 终点条件
          const arr = modAnalyseCompete(data.targetUrls);
          res.send({code:0, fileUrls:data.fileUrls, data:arr});
        }

        countSucc ++; // count 到达 fileCount 的时候，才可以进行处理
      }
    });
  });
});

function isTypeChecked(fileExt) {
  if (('.xlsx.xls.numbers').indexOf(fileExt.toLowerCase()) === -1) {
    return false;
  }else {
    return true;
  }
}

module.exports = router;