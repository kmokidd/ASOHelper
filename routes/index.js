"use strict";

const express = require('express');
const router = express.Router();
// sys defined modules
const fs = require('fs');
const path = require('path');

// 全局配置
const Global = {
  correctExt: '.xlsx.xls.numbers.csv',
  targetDir: path.resolve(__dirname, '..') + '/upload'
};

// 中间件，用于处理上传
const multer = require('multer'),
      uploader = multer({  // uploader.single -- 上传单个文件
        dest: Global.targetDir
      });

// 工具模块
const modUtils = require("../mod/mod-utils.js");
// 处理数据
const modParsor = require("../mod/mod-aso-parsor.js");

/* 路由 */
router.get('/', function(req, res, next) {
  res.render('index', { isShow: false });
});



/**
 * 上传关键词+ASO数据，得到结构化data
 * req 中需要包含
 * @param: kw - 关键词
 * @param: file - ASO 数据
 */
router.post('/postData', uploader.single('file'), function(req, res){
  console.log('------ post data in index.js ------');

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
  modUtils.uploadFiles(req.file, Global.targetDir, {}, (data) => {
    console.log('in index.js uploadfiles cb');

    const _data = {
      keywords: req.body.kw,
      filePath: data[0].targetUrl // 只上传了一个文件，所以只有一个地址
    };

    // 分析数据，返回分析结果
    // S1: 实例化分析器
    const mp = new modParsor(_data.keywords, _data.filePath);
    // S2: 执行分析
    const obj = mp.analyze();

    // 响应请求
    res.send({code:0, data: obj});
  });
});

// 检查 req 的合法性
function isReqLegal(req) {
  let msg = 1;
  // 检查上传字段合法性
  if(!req.body.kw) {
    msg = '关键词字段有误';
  }
  else if(!req.file) {
    msg = '上传文件有误';
  }
  // 检查文件类型是否合法
  else if (!modUtils.isCorrectExt(req.file, Global.correctExt)) {
    msg = '此文件类型不允许上传';
  }
  else {}

  return msg;
}

module.exports = router;