"use strict";

const readlineSync = require("readline-sync");

module.exports = exports = () => {
  // Wait for keywords
  const appKeywords = readlineSync.question("应用关键词:");
  console.log("\n");
  // aso data file path
  const xlsFilePath = readlineSync.question("本地 ASO Excel 表格地址:");
  console.log("\n");
  return {
    keywords: appKeywords,
    xlsFilePath: xlsFilePath
  };
  // return [appKeywords, xlsFilePath];
};