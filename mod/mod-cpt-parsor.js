/**
 ** 1. 接收多个 xls 文件
 ** 2. 筛选出 热度>5000，搜索结果数 < 100 的关键词，统计出现的频率
 **
 ** @param xlsx files
 ** @return array
 **/

"use strict";

const fs = require('fs');
const XLSX = require("xlsx"); // analyze xls

// 全局变量
const Config = {
  typeExp: 2,
  typeCount: 3,
  typeFreq: 4 // 关键词出现的频率
};

class CptParsor {
  constructor(fileUrls) {
    this.fileUrls = fileUrls;
  }

  // 处理
  // 循环遍历所有上传的文件
  // 找到符合规则的 word，将其对应的四个cell值都保存下来
  // 所有结果输出到结果数组中
  // 返回数组
  _parse(fileUrls) {
    // 结果数组
    let resultArr = [];

    // 遍历所有上传的文件，匹配、处理、返回
    fileUrls.forEach(fileUrl => {
      // 获取文件名，在统计出现频率的时候会用到
      let fileName = fileUrl.slice(fileUrl.lastIndexOf('/')+1, fileUrl.lastIndexOf('.'));
      fileName = fileName.slice(fileName.indexOf('_')+1);
      console.log(fileName);

      // 获取到 workbook
      const wb = XLSX.readFile(fileUrl);
      const startSheetName = wb.SheetNames[0],
            worksheet = wb.Sheets[startSheetName];

      let rowIndex = 8,
          sheetWordIndex = ["B", rowIndex], // 关键词所在列
          desiredWordCell = worksheet[sheetWordIndex.join("")]; // 关键词开始的那一行

      while(desiredWordCell) {
        let newComer = {
          keyword: `'${desiredWordCell.v}'`,
          data: [],
          from: [fileName]
        };
        newComer.data = __linkRecord(rowIndex, worksheet);

        // 符合条件的，才进一步筛选
        if(((newComer.data[2] >= 5000) && (newComer.data[3] <= 100)) || 
           ((newComer.data[2] >= 4605) && (newComer.data[3] <= 50))) {
          // resultArr.push(newComer);
          __checkExist(newComer);
        }

        // move to next line
        sheetWordIndex[1]++;
        rowIndex++;
        desiredWordCell = worksheet[sheetWordIndex.join("")];
      }

      // 删除文件 
      fs.unlinkSync(fileUrl);
    });
    return resultArr;

    // linkRecord
    // record which has related word will be
    // pushed into specific array as the corresponding value of
    // the word
    function __linkRecord(index, worksheet) {
      let sheetRankIndex = ["C", index],
        sheetDeltaIndex = ["D", index],
        sheetExpIndex = ["E", index],
        sheetCountIndex = ["F", index];

      let arr = [];
      const desiredRankValue = worksheet[sheetRankIndex.join("")] ? worksheet[sheetRankIndex.join("")].v : "n",
        desiredDeltaValue = worksheet[sheetDeltaIndex.join("")] ? worksheet[sheetDeltaIndex.join("")].v : 0,
        desiredExpValue = worksheet[sheetExpIndex.join("")] ? worksheet[sheetExpIndex.join("")].v : 0,
        desiredCountValue = worksheet[sheetCountIndex.join("")] ? worksheet[sheetCountIndex.join("")].v : 0;

      arr.push(desiredRankValue, desiredDeltaValue, desiredExpValue, desiredCountValue);

      return arr;
    }

    // 检查 resultArr 中有没有存在 newComer 
    // 有 --> 记录来源
    // 没有 --> resultArr.push
    function __checkExist(newComer) {
      const index = resultArr.findIndex(item => {
        return item.keyword == newComer.keyword;
      });
      
      // 没有
      if(index < 0) {
        resultArr.push(newComer);
      }else { // 有
        resultArr[index].from.push(newComer.from[0]);
      }
    }
  }

  // arr -> resultArr
  // type -> 4种属性
  // order -> -1 从小到大排列，1 从大到小排列
  _sort(arr, type, order) {
    arr.sort((prev, next) => {
      if(order < 0) // 从小到大排列
        return prev.data[type] - next.data[type];
      else // 从大到小排列
        return next.data[type] - prev.data[type];
    });
    return arr;
  }

  analyze() {
    // S1 处理数据
    let resultArr = this._parse(this.fileUrls);
    // S2 排序，以 typecount 为基准，从小到大排序
    resultArr = this._sort(resultArr, Config.typeCount, -1);
    console.log(resultArr);

    return resultArr;
  }
}

/**
 * API
 */
module.exports = exports = CptParsor;