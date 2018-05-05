/**
 ** result sort
 ** from Rank, Delta, Exp and Result-count
 ** @return array
 **/

/*jslint es6*/
/*jslint node: true */
"use strict";

module.exports = exports = function(arr, indicator, order){
  // let _arr = Array.from(arr);
  let _arr = arr.map(a => ({...a}));

  let n = 0;

  if(indicator === "rank") {
    n = 0;
  }
  else if(indicator === "delta") {
    n = 1;
  }
  else if(indicator === "exp") {
    n = 2;
  }
  else if(indicator === "count") {
    n = 3;
  }
  else {
    // result = [];
    return 0;
  }

  if(order>0) {
    _arr.sort((cur, next)=> { return cur.data[n] - next.data[n];} );
  }else {
    _arr.sort((cur, next)=> { return next.data[n] - cur.data[n];} );
  }
  return _arr;
};

// 对每个分词进行排序
/*
function sortSegWord(arr, indicator, order) {
  let result = {
    status: 200,
    arr: []
  };

  let n = 0;

  if(indicator === "rank") {
    n = 0;
  }
  else if(indicator === "delta") {
    n = 1;
  }
  else if(indicator === "exp") {
    n = 2;
  }
  else if(indicator === "count") {
    n = 3;
  }
  else {
    result.status = 404;
    return result;
  }

  if(order>0) {
    arr.sort((cur, next)=> { return cur.data[n] - next.data[n];} );
  }else {
    arr.sort((cur, next)=> { return next.data[n] - cur.data[n];} );
  }
  result.arr = arr;
  return result;
}
*/

