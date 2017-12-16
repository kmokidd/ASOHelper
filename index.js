'use strict';

const XLSX = require('xlsx'),
      nodejieba = require("nodejieba")

// put xlsx in the same dir
const DATA = require('./data.js')

// rule check
const Dye = require('./mod-rules.js')

const keywords = DATA.myKeywords,
      keywordsArr = keywords.split(',')

const xlsFile = DATA.xlsFileName

const obj = main()
// console.log("%j", obj)


// ************************************************************** //

function main() {
  let dic = {}

  for (let keyword of keywordsArr) {
    let result = nodejieba.cut(keyword)
      // convert array to set to delete duplicate words
    dic[keyword] = Array.from(new Set(generateReGroup(result)))
  }

  // keyword with corresponding records
  const parsedDic =  goThroughXlsx(xlsFile, dic)

  let dyedDic = {}
  for(let keyword in parsedDic) {
    let pair = {}
    pair[keyword] = parsedDic[keyword]
    dyedDic[keyword] = dyeKeyword(pair)
  }
}


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

  let result = Array.from(sliptedWordsArr)
  for (let combo of generateCombinations(sliptedWordsArr)) {
    result.push(combo.join(''))
  }
  return result;
}

// go through whole xls file
// compare each keyword in dic
function goThroughXlsx(filePath, dic) {
  const wb = XLSX.readFile(filePath)
  const startSheetName = wb.SheetNames[0],
    worksheet = wb.Sheets[startSheetName]

  let colIndex = 8
  let sheetWordIndex = ['B', colIndex],
    sheetRankIndx = ['C', colIndex],
    sheetDeltaIndex = ['D', colIndex],
    sheetExpIndex = ['E', colIndex],
    sheetCountIndex = ['F', colIndex]

  let desiredWordCell = worksheet[sheetWordIndex.join('')]

  let parsedDic = {}
  while (desiredWordCell) {
    // 得到每一个
    let curWordValue = desiredWordCell.v

    for (let key in dic) {
      if (!parsedDic[key])
        parsedDic[key] = {}

      dic[key].forEach(seg => {
        // let record = desiredWordCell.v
        // 找到匹配的 record 了
        if (curWordValue.includes(seg)) {
          parsedDic[key][curWordValue] = linkRecord(colIndex)
        }
      })
    }

    sheetWordIndex[1]++;
    colIndex++;

    desiredWordCell = worksheet[sheetWordIndex.join('')]

    // 测试用，会删掉
    if (sheetWordIndex[1] === 20)
      break;
  }

  return parsedDic

  // linkRecord
  // record which has related word will be
  // pushed into specific array as the corresponding value of
  // the word
  function linkRecord(index) {
    let sheetRankIndex = ['C', index],
        sheetDeltaIndex = ['D', index],
        sheetExpIndex = ['E', index],
        sheetCountIndex = ['F', index]

    let arr = []
    const desiredRankValue = worksheet[sheetRankIndex.join('')] ? worksheet[sheetRankIndex.join('')].v : 'n',
      desiredDeltaValue = worksheet[sheetDeltaIndex.join('')] ? worksheet[sheetDeltaIndex.join('')].v : 'blank',
      desiredExpValue = worksheet[sheetExpIndex.join('')] ? worksheet[sheetExpIndex.join('')].v : 'blank',
      desiredCountValue = worksheet[sheetCountIndex.join('')] ? worksheet[sheetCountIndex.join('')].v : 'blank'

    arr.push(desiredRankValue, desiredDeltaValue, desiredExpValue, desiredCountValue)

    return arr
  }

}

// dyeKeywords
// 符合”保留条件“的 green
// 符合”剔除条件“的 red
// default, black
function dyeKeyword(keyword) {
  // console.log(keyword)
  // 符合保留条件
  const flag = Dye.examRecord(keyword)
  if(flag === 0)
    return 'black'
  else if(flag > 0)
    return 'green'
  else
    return 'red'
}