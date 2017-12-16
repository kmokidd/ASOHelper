// rules for color
// return Bool

'use strict'

const RULES = require('./config.js')

let isInRankLimit, isDeltaGood, isCompetitive,
    isOutRankLimit, isDeltaBad

let _keyword // accept record from caller



const checkRules = {
  checkRank() {
    
  },
  checkDeltaGood() {

  },
  checkDelatBad() {

  },
  checkCompetitve() {

  }
}





module.exports = exports = {
  examRecord: function(keyword){
    _keyword = keyword

    const sizeOfKeyword = Object.keys(keyword).length

    let rankOfKeptRule = 0,
        rankOfRemovedRule = 0,
        deltaUp = 0,
        deltaDown = 0,
        competitive = 0

    for(let record in keyword) {
      let rank = keyword[record][0],
          delta = parseInt(keyword[record][1]),
          hotness = keyword[record][2],
          count = keyword[record][3]

      // >80%, 20
      if(rank < 20) rankOfKeptRule ++
      if(!isNaN(delta)) {
        delta>=0? deltaUp++ : deltaDown++
      }
      if(hotness>6000 && count<600) competitive++
    }

    if(rankOfKeptRule/sizeOfKeyword > 0.8)
      rankResult = 1
    if(deltaUp/sizeOfKeyword > 0.5 && deltaDown/sizeOfKeyword < 0.2 )
      deltaGoodResult = 1
    if(deltaDown/sizeOfKeyword > 0.7)
      deltaGoodResult = 1
    if(competitive>0)
      competitive = 1



    // const rankResult = checkRules.checkRank(),
    //       competitiveResult = checkRules.checkCompetitve(),
    //       deltaGoodResult = checkRules.checkDeltaGood();
    // if(!deltaGoodResult)
    //   deltaBadResult = checkRules.checkDeltaBad();

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