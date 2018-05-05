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

const Dye = require("./mod-rules.js"); // to-be-checked rules



module.exports = exports = function dataParsing(data, cb){

  const keywordsArr = data.keywords.split(",").map(kw => kw.trim());
  const xlsFile = data.xlsFilePath;


  let dic = {};
  // 分词和组词
  for (let keyword of keywordsArr) {
    const engReg = /[a-z]/i;
    if(keyword.length > 5 || engReg.test(keyword))
      dic[keyword] = ["'"+keyword+"'"];
    else {
      let result = nodejieba.cut(keyword); // 中文分词
      dic[keyword] = Array.from(new Set(generateReGroup(result))); // convert array to set to delete duplicate words
    }
  }
  // console.log(dic);

  // keyword with corresponding records
  const parsedDic =  goThroughXlsx(xlsFile, dic);
  // console.log(parsedDic);

  let dyedDic = {};
  for(let keyword in parsedDic) {
    dyedDic[keyword] = dyeKeyword(parsedDic[keyword]);
  }
  if(cb)
    cb();
  return dyedDic;
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
    sheetWordIndex = ["B", colIndex];

  let desiredWordCell = worksheet[sheetWordIndex.join("")];

  let parsedDic = {};
  while (desiredWordCell) {
    let curWordValue = "'"+desiredWordCell.v+"'"; // get value as String of each cell
    // console.log(`---------${curWordValue}---------`);
    // console.log(typeof curWordValue);

    for (let key in dic) {
      if (!parsedDic[key])
        parsedDic[key] = {};

      dic[key].forEach(seg => {
        if (curWordValue.toLowerCase().includes(seg.toLowerCase())) { // case insensetive
          parsedDic[key][curWordValue] = linkRecord(colIndex);
        }
      });
    }

    sheetWordIndex[1]++;
    colIndex++;

    desiredWordCell = worksheet[sheetWordIndex.join("")];

    // --------------- 测试用，会删掉
    // if (sheetWordIndex[1] === 20)
    //   break;
  }

  return parsedDic;

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
      desiredDeltaValue = worksheet[sheetDeltaIndex.join("")] ? worksheet[sheetDeltaIndex.join("")].v : "blank",
      desiredExpValue = worksheet[sheetExpIndex.join("")] ? worksheet[sheetExpIndex.join("")].v : "blank",
      desiredCountValue = worksheet[sheetCountIndex.join("")] ? worksheet[sheetCountIndex.join("")].v : "blank";

    arr.push(desiredRankValue, desiredDeltaValue, desiredExpValue, desiredCountValue);

    return arr;
  }
}

// dyeKeywords
// 符合”保留条件“的 green
// 符合”剔除条件“的 red
// default, black
function dyeKeyword(keyword) {
  let flag = -1
  // 如果没有被收录的关键词，去掉该词
  if (Object.keys(keyword).length >0){
    // 符合保留条件
    flag = Dye.examRecord(keyword);
  }

  if(flag === 0)
    return {color: "black"};
  else if(flag > 0)
    return {color: "green"};
  else
    return {color: "red"};
}