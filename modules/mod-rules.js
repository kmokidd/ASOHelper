/** 
 ** rules for color
 ** @return Bool
 **/

'use strict';

const RULES = require('../config.js')

let isInRankLimit, isDeltaGood, isCompetitive,
    isOutRankLimit, isDeltaBad

let _keyword // accept record from caller


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

      //-------- applying rules ------------------------
      if(rank <= 3) rankOfKeptRule += 30
      else if(rank <= 10) rankOfKeptRule += 10
      // if(sizeOfKeyword > )
      // >80%, 20
      else if(rank < 20) rankOfKeptRule ++
      else
        continue
        
      if(!isNaN(delta)) {
        delta>=0? deltaUp++ : deltaDown++
      }
      if(hotness>6000 && count<600) competitive++
      //-------- applying rules --------------------------
    }

    let rankResult = 0,
        deltaGoodResult = 0,
        deltaBadResult = 0,
        competitiveResult = 0

    if(rankOfKeptRule/sizeOfKeyword > 0.8)
      rankResult = 1
    if(deltaUp/sizeOfKeyword > 0.5 && deltaDown/sizeOfKeyword < 0.2 )
      deltaGoodResult = 1
    if(deltaDown/sizeOfKeyword > 0.7)
      deltaBadResult = 1
    if(competitive>0)
      competitiveResult = 1


    // kept
    if(rankResult || competitiveResult|| deltaGoodResult)
      return 1;
    // remove
    else if((!rankResult) && (!competitiveResult) && deltaBadResult)
      return -1;
    // considering
    else
      return 0;
  }
}