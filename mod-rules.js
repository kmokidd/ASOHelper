// rules for color
// return Bool

'use strict'

const RULES = require('config.js')

let isInRankLimit, isDeltaGood, isCompetitive,
    isOutRankLimit, isDeltaBad

let _record // accept record from caller



const checkRules = {
  checkRank: {

  },
  checkDeltaGood: {

  },
  checkDelatBad: {

  },
  checkCompetitve: {

  }
}





module.exports = exports = {
  setRecord: function(record) {
    _record = record
  },
  examRecord: function(){
    const rankResult = checkRules.checkRank(),
          competitiveResult = checkRules.checkCompetitve(),
          deltaGoodResult = checkRules.checkDeltaGood();
    if(!deltaGoodResult)
      deltaBadResult = checkRules.checkDeltaBad();

    // kept
    if(rankResult || competitiveResult || deltaGoodResult)
      return 1;
    // remove
    else if((!rankResult) && (!competitiveResult) && deltaBadResult)
      return -1;
    // considering
    else 
      return 0;
  }
}