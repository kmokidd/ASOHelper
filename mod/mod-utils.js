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
 * 字数检查
 * @param: input - [any]，无论输入的是什么都会被转成 string 来统计
 * @param: minLen - [number]，最小字符数限制，>= 0
 * @param: maxLen - [number]，最大字符数限制，>=0
 * @param: engSense - [boolean]，是否需要区分中英文，开启后英文字符=1/2中文字符数
 * @return: { isLegal: true, // 是否符合 length 限制
 *            msg: [string], // 出错提示
 *            inputLen: [number] // 实际输入了多少个字符
 *          }
 */
function lengthCheck(input, minLen=-1, maxLen=-1, engSense=false) {
  let inputLen = input.length;

  // 中英文统计打开，英文算半个字符数
  if (engSense) {
    if(/[0-9a-z]/i.test(input)) {
      const times = input.match(/[0-9a-z]/ig).length;
      inputLen -= times/2;
    }
  }

  // 构建返回值
  let returnObj = {
    isLegal: true,
    msg: '',
    inputLen: inputLen
  };

  // 条件设置错误
  if((minLen > maxLen) && (maxLen>=0)) {
    returnObj.msg = '条件设置错误，minLen 大于 maxLen';
  }
  // 只有最小值限制
  else if( minLen>=0 && maxLen<0) {
    if(inputLen<minLen) {
      returnObj.isLegal = false;
      returnObj.msg = '字符数不够';
    }
  }
  // 只有最大值限制
  else if(minLen<0 && maxLen>=0) {
    if(inputLen > maxLen) {
      returnObj.isLegal = false;
      returnObj.msg = '字符数超出';
    }
  }
  // 有最大值和最小值的限制
  else if(minLen >=0 && maxLen >=0 && minLen >= maxLen) {
    if(inputLen<minLen || inputLen >maxLen) {
      returnObj.isLegal = false;
      returnObj.msg = '字符数不在范围内';
    }
  }
  else {}

  return returnObj;
}


/**
 * API
 */
exports.isCorrectExt = isCorrectExt;
exports.uploadFiles = uploadFiles;
exports.lengthCheck = lengthCheck;