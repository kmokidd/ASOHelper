/** ASO Helper
 ** generate ASO advice
 ** according to given keywords, ASO data and rules
 **
 ** ----- HOW TO USE ----- **
 ** if needed, update data.js and mod-rules.js
 ** > node main.js
 ** then check browser
 */



'use strict';

/* 3rd party node modules */
const Ora = require('ora'); // a loading gif

/* self-written modules */
const DATA = require('./data.js'), // source data, app's keywords and xlsx from ASO100
      modParseData = require('./modules/mod-parse-data.js'),
      modDataVisualization = require('./modules/mod-data-visualize.js');

const keywordsArr = DATA.myKeywords.split(','),
      xlsFile = DATA.xlsFileName;


// main();

// function main() {
  // 1. get parsed data in JSON structure
  const spinner = new Ora({ text: '处理中...'});
  spinner.start();
  const obj = modParseData(keywordsArr, xlsFile);
  spinner.succeed('处理完成！\n'); // loading ends


  // 2. pass data gotten above to an .html, and open it in browser
  modDataVisualization('index2.html', 'index.html', JSON.stringify(obj));
// }