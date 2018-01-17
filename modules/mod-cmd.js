"use strict";

const readlineSync = require("readline-sync");

module.exports = exports = () => {
  // Wait for keywords
  const appKeywords = readlineSync.question("Please input your App's keywords:");
  // aso data file path
  const xlsFilePath = readlineSync.question("ASO Excel file put here:");
  console.log("\n");
  return {
    keywords: appKeywords,
    xlsFilePath: xlsFilePath
  };
};