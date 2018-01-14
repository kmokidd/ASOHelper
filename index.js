'use strict';
const XLSX = require('xlsx'), // analyze xls
      nodejieba = require("nodejieba"),  // 中文分词
      Ora = require('ora'), // a loading gif
      open = require("open"), // open a result index
      fs = require('fs'); // write .html file


// put xlsx in the same dir
const DATA = require('./data.js');

// rule check
const Dye = require('./mod-rules.js');

const keywords = DATA.myKeywords,
      keywordsArr = keywords.split(',');

const xlsFile = DATA.xlsFileName;


// ------------------------------------------------------------- //
main();
// ------------------------------------------------------------- //

// ************************************************************** //

function main() {
  // data processing
  const obj = dataProcessing();
  console.log("%j", obj);

  // 测试用-------------
  // const obj = { "key1": {color: "c1"}, "key2": {color: "c2"}};

  // data visualization
  writeAndOpen('index2.html', 'index.html', JSON.stringify(obj));

  function dataProcessing() {
    // data process loading
    const spinner = new Ora({ text: '处理中...'});
    spinner.start();

    // true start point
    let dic = {};
    for (let keyword of keywordsArr) {
      let result = nodejieba.cut(keyword);
        // convert array to set to delete duplicate words
      dic[keyword] = Array.from(new Set(generateReGroup(result)));
    }
    // keyword with corresponding records
    const parsedDic =  goThroughXlsx(xlsFile, dic);
    // console.log(parsedDic)

    let dyedDic = {};
    for(let keyword in parsedDic) {
      dyedDic[keyword] = dyeKeyword(parsedDic[keyword]);
    }

    // loading ends
    spinner.succeed('处理完成！\n');

    return dyedDic;
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
  const wb = XLSX.readFile(filePath);
  const startSheetName = wb.SheetNames[0],
    worksheet = wb.Sheets[startSheetName];

  let colIndex = 8;
  let sheetWordIndex = ['B', colIndex],
    sheetRankIndx = ['C', colIndex],
    sheetDeltaIndex = ['D', colIndex],
    sheetExpIndex = ['E', colIndex],
    sheetCountIndex = ['F', colIndex];

  let desiredWordCell = worksheet[sheetWordIndex.join('')];

  let parsedDic = {};
  while (desiredWordCell) {
    // 得到每一个
    let curWordValue = desiredWordCell.v;

    for (let key in dic) {
      if (!parsedDic[key])
        parsedDic[key] = {};

      dic[key].forEach(seg => {
        // 找到匹配的 record 了
        if (curWordValue.includes(seg)) {
          parsedDic[key][curWordValue] = linkRecord(colIndex);
        }
      })
    }

    sheetWordIndex[1]++;
    colIndex++;

    desiredWordCell = worksheet[sheetWordIndex.join('')];

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
    let sheetRankIndex = ['C', index],
        sheetDeltaIndex = ['D', index],
        sheetExpIndex = ['E', index],
        sheetCountIndex = ['F', index];

    let arr = [];
    const desiredRankValue = worksheet[sheetRankIndex.join('')] ? worksheet[sheetRankIndex.join('')].v : 'n',
      desiredDeltaValue = worksheet[sheetDeltaIndex.join('')] ? worksheet[sheetDeltaIndex.join('')].v : 'blank',
      desiredExpValue = worksheet[sheetExpIndex.join('')] ? worksheet[sheetExpIndex.join('')].v : 'blank',
      desiredCountValue = worksheet[sheetCountIndex.join('')] ? worksheet[sheetCountIndex.join('')].v : 'blank';

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
    flag = Dye.examRecord(keyword)
  }

  if(flag === 0)
    return {color: "black"}
  else if(flag > 0)
    return {color: "green"}
  else
    return {color: "red"}
}

function writeAndOpen(filePath, tmplPath, resultData) {

  let cont = '';

  let innerHTMLScript = `<script>
        const result = new Vue({
          el: '.l--txt',
          data: {
            keywords: ${resultData}
          }
        })
      </script>
      </body>
      </html>`;

  fs.open(tmplPath, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }
      throw err;
    }
    
    fs.readFile(tmplPath, 'utf8', (err, data)=>{
      if(err) throw err;
      cont = data + innerHTMLScript;

      // 写入文件
      fs.open(filePath, 'wx', (err, fd) => {
        if(err) {
          if (err.code === 'EEXIST')
            console.error('文件已存在，将被覆盖');
          else
            throw err;
        }

        fs.writeFile(filePath, cont, (err) => {
          if (err) throw err;

          // 写完就关上
          fs.closeSync(fs.constants.O_RDWR);

          // 成功写入后打开结果页
          open(filePath);
        });
      });
    })
  })

}