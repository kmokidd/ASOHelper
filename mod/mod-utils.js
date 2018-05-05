const fs = require('fs');
const path = require('path');

/**
 * 文件类型检查
 * @param: fileArr - [string | array]，上传的文件地址，可以是单个也可以是多个
 * @param: correctExt - [string]，合法的扩展名，eg: '.xlsx.xls.numbers'
 * @return: [boolean]
 */
function isCorrectExt(fileArr, correctExt){
  let flag = true;

  // 上传单个文件时，不是一个数组
  // 变成数组，统一处理
  if(!fileArr.length) fileArr = new Array(fileArr);

  for(let file of fileArr) {
    let fileExt = file.originalname.substring(file.originalname.lastIndexOf('.'));
    if(correctExt.indexOf(fileExt.toLowerCase()) === -1) {
      flag = false;
      break;
    }
  }
  return flag;
}

/**
 * 不是用 promise 处理的版本，已弃用
 * 
function uploadFiles_old(fileArr, targetDir, data, cb) {
  // data 中的 value 由 服务器端决定
  // 但使用是在 cb 中
  data.fileUrls = [];
  data.targetUrls = [];

  // 上传单个文件时，不是一个数组
  // 变成数组，统一处理
  if(!fileArr.length) fileArr = new Array(fileArr);
  
  // 创建上传目录
  if (!fs.existsSync(targetDir)) {
    fs.mkdir(targetDir);
  }

  fileArr.forEach(file => {
    //以当前时间戳对上传文件进行重命名
    let fileName = `${new Date().getTime()}_${file.originalname}`;
    let targetFileUrl = path.join(targetDir, fileName);
    //移动文件
    fs.rename(file.path, targetFileUrl, (err) => {
      if(err) {
        console.info(err);
        res.json({code:-1, message:'操作失败'});
      }else {
        data.fileUrls.push(`/compete/${fileName}`); // 只有 compete 会用到
        data.targetUrls.push(targetFileUrl); // index 和 compete 都会用到
        if(cb)
          cb(data);
      }
    });
  });
}
**/

/**
 * 上传文件
 * @param: fileArr - [string | array]，上传的文件地址，可以是单个也可以是多个
 * @param: targetDir - [string]，服务器上的目标目录，文件即将上传到这里
 * @param: opt - [object] 空对象，暂时没有作用，考虑作为配置文件，和要传入 cb 的参数做合并后再传入 cb
 * @param: cb - 回调函数
 * @return: 有错误抛出错误，没有错误执行 cb
 */
async function uploadFiles(fileArr, targetDir, opt, cb) {
  // 上传单个文件时，不是一个数组
  // 变成数组，统一处理
  if(!fileArr.length) fileArr = new Array(fileArr);
  
  // 创建上传目录
  if (!fs.existsSync(targetDir)) {
    fs.mkdir(targetDir);
  }

  // 上传文件
  let mvP = [];
  fileArr.forEach(file => {
    let fileName = `${new Date().getTime()}_${file.originalname}`;
    mvP.push(__pGerenator(file, fileName)); // 可能会有多个上传任务
  });

  // 全部上传结束后
  Promise.all(mvP)
    .then((data)=>{ // 成功，执行回调
      console.log("All Promise finished");
      console.log(data);
      if(cb)
        cb(data);
    }, 
    (err)=>{ // 失败，抛出错误
    console.log(err);
    return err;
  });


  // 每个 fs.rename 人物都是一个新的 promise
  function __pGerenator(file, fileName) {
    let targetFileUrl = path.join(targetDir, fileName); // 上传后的文件地址
    let p = new Promise((resolve, reject) => {
      //移动文件
      fs.rename(file.path, targetFileUrl, (err) => {
        if(err) {
          reject(err);
        }else {
          resolve({
            fileUrl: `/compete/${fileName}`, // 只有 compete 会用到
            targetUrl: targetFileUrl // index 和 compete 都会用到
          });
        }
      });
    });
    return p;
  }
}



/**
 * API
 */
exports.isCorrectExt = isCorrectExt;
exports.uploadFiles = uploadFiles;