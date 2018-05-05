"use strict";

const express = require('express');
const router = express.Router();
// sys defined modules
const fs = require('fs');
const path = require('path');

// 全局配置
const Global = {
  correctExt: '.xlsx.xls.numbers',
  targetDir: path.resolve(__dirname, '..') + '/compete'
};

// 中间件，用于处理上传
const multer = require('multer'),
      uploader = multer({ // uploader.array -- 上传多个文件，最多传 6 个
        // dest: path.resolve(__dirname, '..') + '/compete'
        dest: Global.targetDir
      });

// 工具模块
const modUtils = require("../mod/mod-utils.js");
// 处理数据
const modParsor = require("../mod/mod-cpt-parsor.js");
const modAnalyseCompete = require("../mod/mod-analyse-compete.js");

/* 路由 */
router.get('/', function(req, res, next) {
  res.render('compete', { isShow: false });
});


/**
 * 上传竞品 ASO 数据，得到结构化data
 * req 中需要包含
 * @param: files - ASO 数据
 */
router.post('/postCompeteData', uploader.array('competitors', 6), function(req, res){
  console.log('post data in compete.js');

  // 上传字段的合法检查
  const msg = isReqLegal(req);
  if(msg != 1) {
    res.json({code:-1, message: msg});
    return;
  }

  // ---------- 上传的两个字段都是合法的 ----------- //
  /** 上传文件，处理数据
    * callback 中传入的 data 结构
    * [{
    *   fileUrl: '',
    *   targetUrl: ''
    * },{
    *   fileUrl: '',
    *   targetUrl: ''
    * }]
    */

  modUtils.uploadFiles(req.files, Global.targetDir, {}, (data) => {
    console.log('in compete.js uploadfiles cb');
    
    // 数据格式处理，改成 modAnalyseCompete 合法的参数格式
    let tmpObj = {
      fileUrls: data.map(obj => obj.fileUrl),
      targetUrls: data.map(obj => obj.targetUrl)
    };

    // 分析数据，返回分析结果
    // 初始化分析器
    const mp = new modParsor(tmpObj.targetUrls);
    // 调用分析方法
    const arr = mp.analyze();

    // 响应请求
    res.send({code:0, fileUrls: tmpObj.fileUrls, data:arr});
  });
});

// 检查 req 的合法性
function isReqLegal(req) {
  let msg = 1;
  // 检查上传文件字段合法性
  if(!req.files) {
    msg = '上传文件有误';
  }
  // 检查文件类型是否合法
  else if (!modUtils.isCorrectExt(req.files, Global.correctExt)) {
    msg = '此文件类型不允许上传';
  }
  else {}

  return msg;
}

module.exports = router;