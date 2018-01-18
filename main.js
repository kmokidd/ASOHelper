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
const getCmd = require("./modules/mod-cmd.js"),
  modParseData = require("./modules/mod-parse-data.js"),
  modDataVisualization = require("./modules/mod-data-visualize.js");

  
/* BEGIN */

const data = getCmd(); // get user input from cmd

const spinner = ora("处理中...").start(); // show loading spinner
setTimeout(function () {
  const obj = modParseData(data); // data processing
  spinner.succeed("处理完成！\n"); // loading spinner ends
  // console.log("%j", obj);
  modDataVisualization("index2.html", "template.html", JSON.stringify(obj)); // show resule in browser
}, 2000);