// rules for color
// return Bool

'use strict'

const RULES = require('mod-rules.js')

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
  isKept: function() {
    if (isInRankLimit || isDeltaGood || isCompetitive)
      return true
    else
      return false
  },
  isRemoved: function() {
    if (isOutRankLimit || isDeltaBad)
      return true
    else
      return false
  }
}