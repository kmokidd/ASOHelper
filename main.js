/** ASO Helper
 ** generate ASO advice
 ** according to given keywords, ASO data and rules
 **
 ** ----- HOW TO USE ----- **
 ** if needed, update data.js and mod-rules.js
 ** > node main.js
 ** then check browser
 */

"use strict";

/* 3rd party node modules */
const ora = require("ora"); // a loading gif

/* self-written modules */
const Data = require("./data.js"), // source data, app's keywords and xlsx from ASO100
  modParseData = require("./modules/mod-parse-data.js"),
  modDataVisualization = require("./modules/mod-data-visualize.js");

/* BEGIN */
const spinner = ora("处理中...").start(); // show loading spinner
setTimeout(function () {
  const obj = modParseData(Data); // data processing
  spinner.succeed("处理完成！\n"); // loading spinner ends
  modDataVisualization("index2.html", "template.html", JSON.stringify(obj)); // show resule in browser
}, 2000);
