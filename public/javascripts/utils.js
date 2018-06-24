"use strict";

/**
 * 字数检查
 * @param: input - [any]，无论输入的是什么都会被转成 string 来统计
 * @param: minLen - [number]，最小字符数限制，>= 0
 * @param: maxLen - [number]，最大字符数限制，>=0
 * @param: engSense - [boolean]，是否需要区分中英文，开启后英文字符=1/2中文字符数
 * @return: { isLegal: true, // 是否符合 length 限制
 *            msg: [string], // 出错提示
 *            inputLen: [number] // 实际输入了多少个字符
 *          }
 */
export function lengthCheck(input, minLen=-1, maxLen=-1, engSense=false) {
  let inputLen = input.length;

  // 中英文统计打开，英文算半个字符数
  if (engSense) {
    if(/[0-9a-z]/i.test(input)) {
      const times = input.match(/[0-9a-z]/ig).length;
      inputLen -= times/2;
    }
  }

  // 构建返回值
  let returnObj = {
    isLegal: true,
    msg: '',
    inputLen: inputLen
  };

  // 条件设置错误
  if((minLen > maxLen) && (maxLen>=0)) {
    returnObj.isLegal = false;
    returnObj.msg = '条件设置错误，minLen 大于 maxLen';
  }
  // 只有最小值限制
  else if( minLen>=0 && maxLen<0) {
    if(inputLen<minLen) {

      returnObj.isLegal = false;
      returnObj.msg = '字符数不够';
    }
  }
  // 只有最大值限制
  else if(minLen<0 && maxLen>=0) {
    if(inputLen > maxLen) {

      returnObj.isLegal = false;
      returnObj.msg = '字符数超出';
    }
  }
  // 有最大值和最小值的限制
  else if(minLen >=0 && maxLen >=0 && minLen <= maxLen) {
    if(inputLen<minLen || inputLen >maxLen) {
      returnObj.isLegal = false;
      returnObj.msg = '字符数不在范围内';
    }
  }
  else {}

  return returnObj;
}

/**
 * 广告法禁用词
 */

export const adForbidden = `最,最佳,最具,最爱,最赚,最优,最优秀,最好,最大,最大程度,最高,最高级,最高端,
                            最奢侈,最低,最低级,最低价,最底,最便宜,史上最低价,最流行,最受欢迎,最时尚,最聚拢,
                            最符合,最舒适,最先,最先进,最先进科学,最后,最新,最新技术,最新科学,第一,中国第一,
                            全网第一,销量第一,排名第一,唯一,第一品牌,NO.1,TOP1,独一无二,全国第一,遗留,一天,
                            仅此一次,最后一波,国家级,国际级,世界级,千万级,百万级,星级,5A,甲级,超甲级,顶级,
                            顶尖,尖端,顶级享受,高级,极品,极佳,绝佳,绝对,终极,极致,致极,极具,完美,绝佳,
                            极佳,至,至尊,至臻,臻品,臻致,臻席,压轴,问鼎,空前,绝后,绝版,无双,非此莫属,
                            巅峰,前所未有,无人能及,顶级,鼎级,鼎冠,定鼎,完美,翘楚之作,不可再生,不可复制,
                            绝无仅有,寸土寸金,淋漓尽致,无与伦比,唯一,卓越,卓著,前无古人后无来者,绝版,珍稀,
                            臻稀,稀少,绝无仅有,绝不在有,稀世珍宝,千金难求,世所罕见,不可多得,空前绝后,
                            寥寥无几,屈指可数,独家,独创,独据,开发者,缔造者,创始者,发明者,首个,首选,独家,
                            首发,首席,首府,首选,首屈一指,全国首家,国家领导人,国门,国宅,首次,填补国内空白,
                            国际品质,黄金旺铺,黄金价值,黄金地段,金钱,金融汇币图片,外国货币,大牌,金牌,名牌,
                            王牌,领先上市,巨星,著名,掌门人,领袖品牌,至尊,冠军,王,之王,王者楼王,墅王,皇家,
                            世界领先,领先,领导者,领袖,引领,创领,领航,耀领,史无前例,前无古人,永久,万能,
                            百分之百,绝无仅有,特供,专供,专家推荐,点击领奖,恭喜获奖,全民免单,点击有惊喜,点击获取,
                            点击转身,领取奖品,抽奖,售罄,售空,再不抢就没了,史上最低价,不会再便宜,未曾有过的,
                            万人疯抢,全民,免费领,免费住,0首付,零距离,帝都,皇城,皇室领地,皇家,皇室,皇族,
                            殿堂,白宫,贵族,高贵,隐贵,上流,层峰,富人区,名门,升值价值,价值洼地,价值天成,
                            千亿价值,投资回报,众筹,抄涨`;