/**
 ** 1. parse keywords and analyze xlsx file
 ** 2. link the two with each other
 ** 3. judge each keyword acrt. Rules
 **
 ** @param string, xlsx file
 ** @return object
 **/

"use strict";

const XLSX = require("xlsx"); // analyze xls
const nodejieba = require("nodejieba");  // 中文分词

const Rule = require("./mod-rules.js"); // to-be-checked rules
const Sort = require("./mod-sort-2.js"); // array sort



module.exports = exports = function dataParsing(data){

  const keywordsArr = data.keywords.split(",").map(kw => kw.trim());
  const xlsFile = data.xlsFilePath;

  // set d3 root
  // 第一层 children 是用逗号分开的关键词 -> keyword
  let dic = {"keyword": "root", "children":[]};

  // 分词和组词
  for (let keyword of keywordsArr) {
    // 第二层 chilren 是被分词的 keyword -> seg
    let innerKw = {"keyword": keyword, "children":[]};

    // 第三层 children 是xls中哪些词包含了对应的 seg -> word
    // 如果是全英文，或者很长（比如“那年花开月正圆”），分词就只有一个，即它自己。不再进行中文分词
    const engReg = /[a-z]/i;
    if(keyword.length > 7 || engReg.test(keyword)){
      innerKw.children.push({"keyword": keyword, "children":[]});
      dic.children.push(innerKw);
    }
    else {
      innerKw.children = [];

      let result = nodejieba.cut(keyword); // 中文分词
      const resultArr = Array.from(new Set(generateReGroup(result))); // convert array to set to delete duplicate words
      resultArr.forEach(function(r){
        innerKw.children.push({"keyword": r, "children":[]});
      });

      dic.children.push(innerKw);
    }
  }

  // console.log('---------------- before goThroughtXlsx ---------------');
  // console.log(dic);

  // 通过 {root {keyword {seg {**word**}}}，找到 **word**
  dic = goThroughXlsx(xlsFile, dic);
  // 将清洗好的数据按照 keyword 分开，重新组合成 keyword-四种排序的数据
  dic = splitKeywords(dic);
  console.log(dic);
  // 将调整好结构的数据，根据 rule 染色
  dic = dyeKeywords(dic);
  return dic;

  // let dyedDic = {};
  // for(let keyword in parsedDic) {
  //   dyedDic[keyword] = dyeKeyword(parsedDic[keyword]);
  // }
  // return dyedDic;
};

// generate all possible grouping
function generateReGroup(sliptedWordsArr) {
  function* generateCombinations(arr) {
    function* doGenerateCombinations(offset, combo) {
      if (combo.length >= 2) {
        yield combo;
      }
      for (let i = offset; i < arr.length; i++) {
        yield * doGenerateCombinations(i + 1, combo.concat(arr[i]));
      }
    }
    yield * doGenerateCombinations(0, []);
  }

  let result = Array.from(sliptedWordsArr);
  for (let combo of generateCombinations(sliptedWordsArr)) {
    result.push(combo.join(""));
  }
  return result;
}

// go through whole xls file
// compare each keyword in dic
function goThroughXlsx(filePath, dic) {
  const wb = XLSX.readFile(filePath);
  const startSheetName = wb.SheetNames[0],
        worksheet = wb.Sheets[startSheetName];

  let colIndex = 8,
      sheetWordIndex = ["B", colIndex]; // 收录词所在列

  let desiredWordCell = worksheet[sheetWordIndex.join("")];

  // 一行一行遍历数据，数据为空即遍历终止
  while (desiredWordCell) {
    // 收录的词
    let curWordValue = "'"+desiredWordCell.v+"'"; // get value as String of each cell

    dic.children.forEach((keyword) => {
      keyword.children.forEach((seg)=>{
        let word = {"keyword": "", "data": []};
        if (curWordValue.toLowerCase().includes(seg.keyword.toLowerCase())) { // case insensetive
          word.keyword = curWordValue;
          word.data = linkRecord(colIndex); // 把匹配的 word 的 rank、delta、exp 和 result 数据存入 data 字段中
          seg.children.push(word);
        }
      });
    });

    // move to next line
    sheetWordIndex[1]++;
    colIndex++;
    desiredWordCell = worksheet[sheetWordIndex.join("")];

    // --------------- 测试用，会删掉
    // if (sheetWordIndex[1] === 2)
    //   break;
  }

  // console.log('--------- dic ---------');
  // console.log(dic);
  // return cleanDic(dic);
  return cleanDic(dic);

  // 去掉没有对应 word 的 seg （比如“企鹅竞”）
  // 针对 rank、delta、exp 和 result 做排序
  // let rankDic = JSON.parse(JSON.stringify(dic)),
  //     deltaDic = JSON.parse(JSON.stringify(dic)),
  //     expDic = JSON.parse(JSON.stringify(dic)),
  //     countDic = JSON.parse(JSON.stringify(dic));


  // cleanAndReorderDic(rankDic, "rank", 1); // 正序
  // cleanAndReorderDic(deltaDic, "delta", -1); // 逆序
  // cleanAndReorderDic(expDic, "exp", -1); // 逆序
  // cleanAndReorderDic(countDic, "count", 1); // 正序

  // // 返回四个重排序的数据
  // return [rankDic, deltaDic, expDic, countDic];

  // linkRecord
  // record which has related word will be
  // pushed into specific array as the corresponding value of
  // the word
  function linkRecord(index) {
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
}

// split dic 中的每个 keyword +对应内容到单独的对象中
// 将每组word重新排序，塞回上面 keyword 的对象里，
// 所有的keyword+重排序，重新整合成一个数组，返回
function splitKeywords(dic) {
  // let _dic = cleanDic(dic);
  let _dic = dic;

  let result = [];

  _dic.children.forEach((keyword, index)=> {
    let kwObj = {};
        kwObj.title = keyword.keyword;
        kwObj.cont = []; // 长度为4，每一个item即为一种排序结果
    
    for(let flag =1; flag<=4; flag++){

      let _tmpKw = {};
      _tmpKw.keyword = keyword.keyword;
      _tmpKw.children = [];

      keyword.children.forEach((seg)=> { // 每个 seg.children 都要经过四次排序
        let _seg = {};
          _seg.keyword = seg.keyword;

        if (flag == 1){
          _seg.children  = reorderWord(seg.children, "rank", 1);
        }
        else if (flag == 2)
          _seg.children = reorderWord(seg.children, "delta", -1);
        else if (flag == 3)
          _seg.children = reorderWord(seg.children, "exp", -1);
        else
          _seg.children = reorderWord(seg.children, "count", 1);
        
        _tmpKw.children.push(_seg); // 每一个排好序的 seg tuple 存入 obj
      });

      kwObj.cont.push(_tmpKw);
    }
    result.push(kwObj);
  });

  return result;
}

function cleanDic(dic) {
  dic.children.forEach((child, indexOutter)=>{ // <---- keyword
    let index = child.children.length; // <----- child.children => seg 那一层
    while(index--) {
      let item = child.children[index]; // <--- seg
      if(item.children.length === 0){
        child.children.splice(index,1);
      }
    }
  });
  return dic;
}

// wordArr ==> seg.children
function reorderWord(wordArr, indicator, rankType) {
  let sortedArr = Sort(wordArr, indicator, rankType); // <----- word
  if (sortedArr != 0 )
    wordArr = sortedArr;
  return sortedArr;
}

// 按照指定排列顺序，在不同的指标上进行排序
// 排序的是 word
function cleanAndReorderDic(seg, indicator, rankType) {
  let index = seg.children.length;

  while(index--) {
    let item = seg.children[index];
    if(item.children.length ===0) {
      seg.children.splice(index,1);
    }else {
      // 根据指标排序
      let sortedArr = Sort(item.children, indicator, rankType); // <----- word
      if (sortedArr != 0 )
        item.children = sortedArr;
    }
  }


  // dic.children.forEach((child, indexOutter)=>{ // <---- keyword
  //   let index = child.children.length; // <----- child.children => seg 那一层
  //   while(index--) {
  //     let item = child.children[index]; // <--- seg
  //     if(item.children.length === 0){
  //       child.children.splice(index,1);
  //     }else {
  //       // 根据指标排序
  //       let sortedArr = Sort(item.children, indicator, rankType); // <----- word
  //       if (sortedArr != 0 )
  //         item.children = sortedArr;
  //     }
  //   }
  // });
}

// 传入整个数组，给每个 item 加一个 color 字段
// 返回这个数组
function dyeKeywords(arr) {
  let result = {
    decided: [],
    considered: []
  };

  arr.forEach((item) => {
    let flag = Rule.applyRules(item.cont[0]); // cont 长度为4，内容一样，排序不同，默认传入第一个

    switch (flag) {
      case 1:
        item.color = '#7ED321';
        result.decided.push(item);
        break;
      case 0:
        item.color = 'black';
        item.betterWords = Rule.getBetterWords(item.cont[0]);
        result.considered.push(item);
        break;
      case -1:
        item.color = 'red';
        item.betterWords = Rule.getBetterWords(item.cont[0]);
        result.considered.push(item);
        break;
      default:
        item.color = 'blue';
        break;
    }
  });
  // return arr;
  return [arr, result];
}

// dyeKeywords
// 符合”保留条件“的 green
// 符合”剔除条件“的 red
// default, black
// function dyeKeyword(keyword) {
//   let flag = -1;
//   // 如果没有被收录的关键词，去掉该词
//   if (Object.keys(keyword).length >0){
//     // 符合保留条件
//     flag = Rule.examRecord(keyword);
//   }

//   if(flag === 0)
//     return {color: "black"};
//   else if(flag > 0)
//     return {color: "green"};
//   else
//     return {color: "red"};
// }