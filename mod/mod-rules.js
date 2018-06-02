/**
 ** rules for color,
 ** check rules in rules.numbers
 ** @return Bool
 **/

/*jslint es6*/
/*jslint node: true */
"use strict";

/*
const RULES = require("../config.js");

let isInRankLimit, isDeltaGood, isCompetitive,
    isOutRankLimit, isDeltaBad
*/

let _keyword; // accept record from caller

module.exports = exports = {
  // --xxxxxx-- 暂时不用 --xxxxxx--
  examRecord: function(keyword){
    _keyword = keyword;

    const sizeOfKeyword = Object.keys(keyword).length;

    let rankOfKeptRule = 0,
      deltaUp = 0,
      deltaDown = 0,
      competitive = 0;

    for ( let record in keyword) {
      let rank = keyword[record][0],
        delta = parseInt(keyword[record][1]),
        hotness = keyword[record][2],
        count = keyword[record][3];

      //-------- applying rules ------------------------
      if(rank <= 3) rankOfKeptRule += 30;
      else if(rank <= 10) rankOfKeptRule += 10;
      // if(sizeOfKeyword > )
      // >80%, 20
      else if(rank < 20) rankOfKeptRule ++;
      else
        continue;

      if(!isNaN(delta)) {
        delta>=0? deltaUp++ : deltaDown++;
      }
      if(hotness>6000 && count<600) competitive++;
      //-------- applying rules --------------------------
    }

    let rankResult = 0,
      deltaGoodResult = 0,
      deltaBadResult = 0,
      competitiveResult = 0;

    if(rankOfKeptRule/sizeOfKeyword > 0.8)
      rankResult = 1;
    if(deltaUp/sizeOfKeyword > 0.5 && deltaDown/sizeOfKeyword < 0.2 )
      deltaGoodResult = 1;
    if(deltaDown/sizeOfKeyword > 0.7)
      deltaBadResult = 1;
    if(competitive>0)
      competitiveResult = 1;


    // kept
    if(rankResult || competitiveResult|| deltaGoodResult)
      return 1;
    // remove
    else if((!rankResult) && (!competitiveResult) && deltaBadResult)
      return -1;
    // considering
    else
      return 0;
  },

  // 传入 分词-实际收录词-收录词的四个指标，
  // 返回 -1 || 0 || 1 表示该关键词是否需要保留
  applyRules(keywordObj) {
    let segArr = keywordObj.children;
    let sizeOfWords = 0; // 有多少 words

    // 每个 word 的衡量维度
    let rankOfKeptRule = 0,
        deltaUp = 0,
        deltaDown = 0,
        competitive = 0; // 竞争度 = 热度/结果数

    // 四个维度上的总结果
    let rankResult = 0,
        deltaGoodResult = 0,
        deltaBadResult = 0,
        competitiveResult = 0;

    // 用来放所有 word
    // 染色是基于 word 的表现，包括 wordSet 长度、每个 word 的 data 字段
    const wordObj = {};
    segArr.forEach(segObj => {
      let wordArr = segObj.children;
      wordArr.forEach(w => {
        if(!wordObj[w.keyword])
          wordObj[w.keyword] = w.data;
      });
    });

    
    sizeOfWords = Object.keys(wordObj).length;

    console.log(wordObj);
    console.log(Object.keys(wordObj).length);

    for(let key in wordObj) {
      let rank = wordObj[key][0],
          delta = parseInt(wordObj[key][1]),
          hotness = wordObj[key][2],
          count = wordObj[key][3];

      //-------- applying rules ------------------------
      // 添加每种衡量维度上的权重，不同维度，权重不同
      // 比如 rank 的权重是最大的
      if(rank <= 3) rankOfKeptRule += 30;
      else if(rank <= 10) rankOfKeptRule += 20;
      else if(rank <= 20) rankOfKeptRule += 10;
      else if(rank < 30) rankOfKeptRule ++;
      else continue;

      if(!isNaN(delta)) {
        delta>=0? deltaUp++ : deltaDown++;
      }
      if(hotness>6000 && count<200) competitive += 30;
      else if(hotness>5000 && count<100) competitive += 20;
      else if(hotness>4605 && count<50) competitive += 10;
      else continue;
      //-------- applying rules --------------------------
    }

    console.log(`rankOfKeptRule = ${rankOfKeptRule}`);
    console.log(`deltaUp = ${deltaUp}`);
    console.log(`deltaDown = ${deltaDown}`);
    console.log(`competitive = ${competitive}`);

    if(rankOfKeptRule > 9)
      rankResult = 1;
    if(deltaUp/sizeOfWords > 0.5 && deltaDown/sizeOfWords < 0.2 )
      deltaGoodResult = 1;
    if(deltaDown/sizeOfWords > 0.7)
      deltaBadResult = 1;
    if(competitive>0)
      competitiveResult = 1;

    // kept
    if(rankResult || competitiveResult || deltaGoodResult)
      return 1;
    // remove
    else if((!rankResult) && (!competitiveResult) && deltaBadResult)
      return -1;
    // considering
    else
      return 0;
  },

  getBetterWords(keywordObj) {
    const arr = JSON.parse(JSON.stringify(keywordObj));
    arr.betterWords = [];
    const segArr = arr.children;
    segArr.forEach(segObj => {
      const wordArr = segObj.children;
      for(let word of wordArr) {
        if(word.data[0] < 11) { // 排名在10名以内
          if((arr.betterWords.filter(item=> {item.keyword ===word.keyword;})).length===0) // 且未被收录
            arr.betterWords.push(word);
        }else {
          break;
        }
      }
    });

    return arr.betterWords;
  }
};