"use strict";

import {lengthCheck, adForbidden} from './utils.js';

const engPunctuation = /[\[\]\.,\'\"\/#!$%\^&\*;:{}=\-_`~()]/g;
const chiPunctuation = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;

function segLenCheck(data, index, attr, str, minLen, maxLen, flag=false) {
  const obj = lengthCheck(str, minLen, maxLen, flag);
  data[`ap${index}`][attr].counter = obj.inputLen;
  if(!obj.isLegal)
    data[`ap${index}`][attr].isErr = true;
  else
    data[`ap${index}`][attr].isErr = false;
}

const wrap = new Vue({
  el: '.wrap',
  data: {
    appname1: '',
    counter1: 0,
    isErr:false,
    isShow: true,
    rule: {
      kw: {
        oldSpliter:'',
        newSpliter: ''
      }
    },
    appstore: {
      ap0: {
        simpleDesc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap1: {
        name: '通用',
        isChecked: true,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap2: {
        name: 'vivo',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap3: {
        name: 'oppo',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap4: {
        name: '华为',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap5: {
        name: '小米',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap6: {
        name: '魅族',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
      ap7: {
        name: '应用宝',
        isChecked: false,
        appname: {
          cont: '',
          counter: 0,
          isErr: false
        },
        sentence: {
          cont: '',
          counter: 0,
          isErr: false
        },
        keywords: {
          cont: '',
          counter: 0,
          isErr: false
        },
        desc: {
          cont: '',
          counter: 0,
          isErr: false
        }
      },
    }
  },
  methods: {
    exp() {
      function _s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

      function _contructJson(appstore) {
        let arr = [];
        for(const asIndex in appstore) {
          // the 1st one is used to store common content, can be skipped
          // only checked store will be exported
          if(asIndex != 'ap0' && appstore[asIndex].isChecked) {
            const app = {};
            app['市场名'] = appstore[asIndex].name;
            app['应用名称'] = appstore[asIndex].appname.cont.trim();
            app['简单描述'] = appstore.ap0.simpleDesc.cont.trim();
            app['一句话简介'] = appstore[asIndex].sentence.cont.trim();
            app['关键词'] = appstore[asIndex].keywords.cont.trim();
            app['应用名'] = appstore[asIndex].desc.cont.trim();

            arr.push(app);
          }else {
            continue;
          }
        }

        return arr;
      }



      let wb = XLSX.utils.book_new();
      wb.Props = {
              Title: "安卓字段"
              // Subject: "Test"
              // CreatedDate: new Date(2017,12,19)
      };
      wb.SheetNames.push("安卓字段1");
      // wb.SheetNames.push("安卓字段2");
      // wb.SheetNames.push("安卓字段3");
      // wb.SheetNames.push("安卓字段4");
      let ws = XLSX.utils.json_to_sheet(_contructJson(this.appstore));

      // let ws = XLSX.utils.json_to_sheet([{'应用名': this.appstore.ap1.appname.cont, '简单描述': this.appstore.ap0.simpleDesc.cont}]);
      wb.Sheets["安卓字段1"] = ws;

      let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
      saveAs(new Blob([_s2ab(wbout)], {type:"application/octet-stream"}), '安卓字段.xlsx')
    },
    replaceKwSpliter() {
      for(let appIndex in this.appstore) {
        if(this.appstore[appIndex].keywords && this.appstore[appIndex].keywords.counter > 0){
          this.appstore[appIndex].keywords.cont = this.appstore[appIndex].keywords.cont.split(this.rule.kw.oldSpliter).join(this.rule.kw.newSpliter);
        }
      }
    },
    onlyLenCheck(storeIndex, attr, str, minLen, maxLen, flag=false){
      segLenCheck(this.appstore, storeIndex, attr, str, minLen, maxLen, flag);
    },
    sentenceCheck(storeIndex, str, maxLen, flag=false) {
      // oppo 不允许有标点和空格
      switch(storeIndex) {
        case 1:
          this.appstore.ap6.sentence.cont = this.appstore.ap1.sentence.cont;
          break;
        case 6:
          this.appstore.ap1.sentence.cont = this.appstore.ap6.sentence.cont;
          break;
        case 3: 
          str = str.split(' ').join(''); // 先把空格去掉
          str = str.replace(engPunctuation,"").replace(chiPunctuation, ""); // 再把标点去掉
          this.appstore[`ap${storeIndex}`].sentence.cont = str;
          break;
        default:
          break;
      }

      // 通用和魅族共用字段
      if(storeIndex === 1 || storeIndex === 6){
        segLenCheck(this.appstore, 1, 'sentence', str, 0, maxLen);
        segLenCheck(this.appstore, 6, 'sentence', str, 0, maxLen);
      }else {
        segLenCheck(this.appstore, storeIndex, 'sentence', str, 0, maxLen);
      }
    },
    keywordsCheck(storeIndex, str, maxLen) {
      // 华为要检查被空格分隔的个数，不能超过 4 个
      switch(storeIndex) {
        case 4:
          let kwLen = str.split(' ').length;
          if(kwLen > 4) {
            this.appstore[`ap${storeIndex}`].keywords.isErr = true;
            return;
          }
          break;
        case 5:
        case 6:
          this.appstore.ap6.keywords.cont = this.appstore.ap5.keywords.cont;
          break;
        // case 6:
        //   this.appstore.ap5.keywords.cont = this.appstore.ap6.keywords.cont;
        //   break;
        default:
          break;
      }

      // 小米和魅族共用字段
      if(storeIndex === 5 || storeIndex === 6){
        segLenCheck(this.appstore, 5, 'keywords', str, 0, maxLen);
        segLenCheck(this.appstore, 6, 'keywords', str, 0, maxLen);
      }else {
        segLenCheck(this.appstore, storeIndex, 'keywords', str, 0, maxLen);
      }
    },
    descCheck(storeIndex, str, minLen, maxLen) {
      // 应用宝需要检查广告法
      if(storeIndex === 7) {
        const adForbiddenArr = adForbidden.split(',');
        for(const item of adForbiddenArr) {
          if(str.indexOf(item) >=0) {
            this.appstore[`ap${storeIndex}`].desc.isErr = true;
            return false;
          }
        }
      }

      switch(storeIndex) {
        case 2:
        case 4:
        case 6:
          this.appstore.ap4.desc.cont = this.appstore.ap6.desc.cont = this.appstore.ap2.desc.cont;
          break;
        default:
          break;
      }

      // vivo 华为 魅族共用字段
      if(storeIndex === 2 || storeIndex === 4 || storeIndex === 6) {

        segLenCheck(this.appstore, 2, 'desc', str, minLen, maxLen);
        segLenCheck(this.appstore, 4, 'desc', str, minLen, maxLen);
        segLenCheck(this.appstore, 6, 'desc', str, minLen, maxLen);
      }else {
        segLenCheck(this.appstore, storeIndex, 'desc', str, minLen, maxLen);
      }
    }
  }
});