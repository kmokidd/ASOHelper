<template>
  <section class="form">
    <!-- 市场列表 -->
    <section class="form-bd">
      <dl class="form-item">
        <dt class="form-item-hd title-item">请勾选你想要的平台</dt>
        <dd class="form-item-bd">
          <ul class="market-list">
            <li class="market">
              <input
                type="checkbox"
                name
                v-model="appstore.ap1.isChecked"
                :checked="appstore.ap1.isChecked"
              >
              <section class="market-inner">
                <span>通用</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap2.isChecked"
                v-model="appstore.ap2.isChecked"
              >

              <section class="market-inner">
                <span>vivo</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap3.isChecked"
                v-model="appstore.ap3.isChecked"
              >
              <section class="market-inner">
                <span>oppo</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap4.isChecked"
                v-model="appstore.ap4.isChecked"
              >
              <section class="market-inner">
                <span>华为</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap5.isChecked"
                v-model="appstore.ap5.isChecked"
              >
              <section class="market-inner">
                <span>小米</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap6.isChecked"
                v-model="appstore.ap6.isChecked"
              >
              <section class="market-inner">
                <span>魅族</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
            <li class="market">
              <input
                type="checkbox"
                name
                :checked="appstore.ap7.isChecked"
                v-model="appstore.ap7.isChecked"
              >
              <section class="market-inner">
                <span>应用宝</span>
                <i class="icon icon-checked"></i>
              </section>
            </li>
          </ul>
        </dd>
      </dl>

      <!-- 要填写的字段 -->
      <section class="form" v-show="isShow" v-cloak>
        <dl class="form-item">
          <dt class="form-item-hd subtitle-item">应用名</dt>
          <dd class="form-item-bd">
            <!-- 8个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap1.appname.isErr}"
              v-if="appstore.ap1.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="appname"
                placeholder="通用，8个字符以内"
                @keyup="onlyLenCheck(1, 'appname', appstore.ap1.appname.cont, 0, 8, false)"
                v-model="appstore.ap1.appname.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap1.appname.counter}}</span>/8
              </span>
            </section>
            <!-- 20个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap2.appname.isErr}"
              v-if="appstore.ap2.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="appname"
                placeholder="vivo 市场，20个字符以内"
                @keyup="onlyLenCheck(2, 'appname', appstore.ap2.appname.cont, 0, 20, false)"
                v-model="appstore.ap2.appname.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap2.appname.counter}}</span>/20
              </span>
            </section>
            <!-- 8个汉字/16个英文字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap5.appname.isErr}"
              v-if="appstore.ap5.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="appname"
                placeholder="小米市场，8个字符，英文算半个字符"
                @keyup="onlyLenCheck(5, 'appname', appstore.ap5.appname.cont, 0, 8, true)"
                v-model="appstore.ap5.appname.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap5.appname.counter}}</span>/8
              </span>
            </section>
            <!-- 12个英文字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap6.appname.isErr}"
              v-if="appstore.ap6.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="appname"
                placeholder="魅族市场，12个字符"
                @keyup="onlyLenCheck(6, 'appname', appstore.ap6.appname.cont, 0, 12, false)"
                v-model="appstore.ap6.appname.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap6.appname.counter}}</span>/12
              </span>
            </section>
          </dd>
        </dl>

        <dl class="form-item">
          <dt class="form-item-hd subtitle-item">简单描述</dt>
          <dd class="form-item-bd">
            <!-- 8个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap0.simpleDesc.isErr}"
              v-show="appstore.ap1.isChecked || appstore.ap2.isChecked || appstore.ap3.isChecked  || appstore.ap4.isChecked  || appstore.ap5.isChecked  || appstore.ap6.isChecked  || appstore.ap7.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="simpleDesc"
                placeholder="8个字符以内"
                @keyup="onlyLenCheck(0, 'simpleDesc', appstore.ap0.simpleDesc.cont, 0, 8, false)"
                v-model="appstore.ap0.simpleDesc.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap0.simpleDesc.counter}}</span>/8
              </span>
            </section>
          </dd>
        </dl>

        <dl class="form-item">
          <dt class="form-item-hd subtitle-item">关键词</dt>
          <dd class="form-item-bd">
            <section class="op">
              <span class="sub">替换分隔符，将</span>
              <input
                class="form-input-tiny"
                type="text"
                placeholder="现有分隔符"
                v-model="rule.kw.oldSpliter"
              >
              <span class="sub">替换为</span>
              <input class="form-input-tiny" type="text" placeholder="新的分隔符" v-model="rule.kw.newSpliter">
              <button class="btn btn-main btn-tiny" @click="replaceKwSpliter()">替换</button>
            </section>

            <!-- 100个字符 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap1.keywords.isErr}"
              v-if="appstore.ap1.isChecked"
            >
              <input
                class="form-input form-input-block"
                type="text"
                autocomplete="off"
                name="keywords"
                placeholder="100个字符以内"
                @keyup="keywordsCheck(1, appstore.ap1.keywords.cont, 100)"
                v-model="appstore.ap1.keywords.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap1.keywords.counter}}</span>/100
              </span>
            </section>
            <!-- 4个，空格分隔，长度不超过 100个字符 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap4.keywords.isErr}"
              v-if="appstore.ap4.isChecked"
            >
              <input
                class="form-input form-input-block"
                type="text"
                autocomplete="off"
                name="keywords"
                placeholder="4个，空格分隔，长度不超过 100个字符"
                @keyup="keywordsCheck(4, appstore.ap4.keywords.cont, 100)"
                v-model="appstore.ap4.keywords.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap4.keywords.counter}}</span>/100
              </span>
            </section>
            <!-- 空格分隔，长度不超过 100个字符 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap5.keywords.isErr}"
              v-if="appstore.ap5.isChecked || appstore.ap6.isChecked"
            >
              <input
                class="form-input form-input-block"
                type="text"
                autocomplete="off"
                name="keywords"
                placeholder="空格分隔，长度不超过 100个字符"
                @keyup="keywordsCheck(5, appstore.ap5.keywords.cont, 100)"
                v-model="appstore.ap5.keywords.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap5.keywords.counter}}</span>/100
              </span>
            </section>
          </dd>
        </dl>

        <dl class="form-item">
          <dt class="form-item-hd subtitle-item">一句话简介</dt>
          <dd class="form-item-bd">
            <!-- 15个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap1.sentence.isErr}"
              v-if="appstore.ap1.isChecked || appstore.ap6.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="sentence"
                placeholder="15个字符以内"
                @keyup="sentenceCheck(1, appstore.ap1.sentence.cont, 15)"
                v-model="appstore.ap1.sentence.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap1.sentence.counter}}</span>/15
              </span>
            </section>
            <!-- 17个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap3.sentence.isErr}"
              v-if="appstore.ap3.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="sentence"
                placeholder="17个字符以内，不能有空格和标点"
                @keyup="sentenceCheck(3, appstore.ap3.sentence.cont, 17)"
                v-model="appstore.ap3.sentence.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap3.sentence.counter}}</span>/17
              </span>
            </section>
            <!-- 18个字符以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap4.sentence.isErr}"
              v-if="appstore.ap4.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="sentence"
                placeholder="18个字符以内"
                @keyup="sentenceCheck(4, appstore.ap4.sentence.cont, 18)"
                v-model="appstore.ap4.sentence.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap4.sentence.counter}}</span>/18
              </span>
            </section>
            <!-- 17个中文或者34个英文以内 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap5.sentence.isErr}"
              v-if="appstore.ap5.isChecked"
            >
              <input
                class="form-input"
                type="text"
                autocomplete="off"
                name="sentence"
                placeholder="17 个汉字或 34 个英文"
                @keyup="sentenceCheck(5, appstore.ap5.sentence.cont, 17, true)"
                v-model="appstore.ap5.sentence.cont"
              >
              <span class="count">
                <span class="number">{{appstore.ap5.sentence.counter}}</span>/17
              </span>
            </section>
          </dd>
        </dl>

        <dl class="form-item">
          <dt class="form-item-hd subtitle-item">应用描述</dt>
          <dd class="form-item-bd">
            <!-- 100 ~ 300 个字 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap1.desc.isErr}"
              v-if="appstore.ap1.isChecked"
            >
              <textarea
                class="form-textarea form-textarea-resize"
                name="desc"
                id
                cols="30"
                rows="10"
                autocomplete="off"
                placeholder="100 ~ 300 个字"
                @keyup="descCheck(1, appstore.ap1.desc.cont, 100, 300)"
                v-model="appstore.ap1.desc.cont"
              ></textarea>
              <span class="count">
                <span class="number">{{appstore.ap1.desc.counter}}</span>/100-300
              </span>
            </section>
            <!-- 100 ~ 1000 个字 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap2.desc.isErr}"
              v-if="appstore.ap2.isChecked || appstore.ap4.isChecked || appstore.ap6.isChecked"
            >
              <textarea
                class="form-textarea form-textarea-resize"
                name="desc"
                id
                cols="30"
                rows="10"
                autocomplete="off"
                placeholder="100 ~ 1000 个字"
                @keyup="descCheck(2, appstore.ap2.desc.cont, 100, 1000)"
                v-model="appstore.ap2.desc.cont"
              ></textarea>
              <span class="count">
                <span class="number">{{appstore.ap2.desc.counter}}</span>/100-1000
              </span>
            </section>
            <!-- 50 ~ 1500 个字 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap3.desc.isErr}"
              v-if="appstore.ap3.isChecked"
            >
              <textarea
                class="form-textarea form-textarea-resize"
                name="desc"
                id
                cols="30"
                rows="10"
                autocomplete="off"
                placeholder="50 ~ 1500 个字"
                @keyup="descCheck(3, appstore.ap3.desc.cont, 50, 1500)"
                v-model="appstore.ap3.desc.cont"
              ></textarea>
              <span class="count">
                <span class="number">{{appstore.ap3.desc.counter}}</span>/50-1500
              </span>
            </section>
            <!-- 500 个字，检查广告法 -->
            <section
              class="input-wrapper"
              :class="{err: appstore.ap7.desc.isErr}"
              v-if="appstore.ap7.isChecked"
            >
              <textarea
                class="form-textarea form-textarea-resize"
                name="desc"
                id
                cols="30"
                rows="10"
                autocomplete="off"
                placeholder="500个字以内，广告法注意"
                @keyup="descCheck(7, appstore.ap7.desc.cont, 0, 500)"
                v-model="appstore.ap7.desc.cont"
              ></textarea>
              <span class="count">
                <span class="number">{{appstore.ap7.desc.counter}}</span>/500
              </span>
            </section>
          </dd>
        </dl>
      </section>
    </section>

    <footer class="form-ft">
      <!-- 导出 -->
      <button class="btn btn-main" @click="exp">导出</button>
    </footer>
  </section>
</template>

<style lang="less" scoped>
.op .form-input-tiny {
  margin: 0 5px;
}
</style>



<script>
import {LengthCheck, AdForbidden} from '@/assets/js/utils.js';

const engPunctuation = /[\[\]\.,\'\"\/#!$%\^&\*;:{}=\-_`~()]/g;
const chiPunctuation = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;

function segLenCheck(data, index, attr, str, minLen, maxLen, flag=false) {
  const obj = LengthCheck(str, minLen, maxLen, flag);
  data[`ap${index}`][attr].counter = obj.inputLen;
  if(!obj.isLegal)
    data[`ap${index}`][attr].isErr = true;
  else
    data[`ap${index}`][attr].isErr = false;
}

export default {
  name: "Android",
  data() {
    return {
      appname1: "",
      counter1: 0,
      isErr: false,
      isShow: true,
      rule: {
        kw: {
          oldSpliter: "",
          newSpliter: ""
        }
      },
      appstore: {
        ap0: {
          simpleDesc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap1: {
          name: "通用",
          isChecked: true,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap2: {
          name: "vivo",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap3: {
          name: "oppo",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap4: {
          name: "华为",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap5: {
          name: "小米",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap6: {
          name: "魅族",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        },
        ap7: {
          name: "应用宝",
          isChecked: false,
          appname: {
            cont: "",
            counter: 0,
            isErr: false
          },
          sentence: {
            cont: "",
            counter: 0,
            isErr: false
          },
          keywords: {
            cont: "",
            counter: 0,
            isErr: false
          },
          desc: {
            cont: "",
            counter: 0,
            isErr: false
          }
        }
      }
    };
  },
  methods: {
    exp() {
      function _s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      function _contructJson(appstore) {
        let arr = [];
        for (const asIndex in appstore) {
          // the 1st one is used to store common content, can be skipped
          // only checked store will be exported
          if (asIndex != 'ap0' && appstore[asIndex].isChecked) {
            const app = {};
            app['市场名'] = appstore[asIndex].name;
            app['应用名称'] = appstore[asIndex].appname.cont.trim();
            app['简单描述'] = appstore.ap0.simpleDesc.cont.trim();
            app['一句话简介'] = appstore[asIndex].sentence.cont.trim();
            app['关键词'] = appstore[asIndex].keywords.cont.trim();
            app['应用名'] = appstore[asIndex].desc.cont.trim();

            arr.push(app);
          } else {
            continue;
          }
        }

        return arr;
      }

      let wb = XLSX.utils.book_new();
      wb.Props = {
        Title: '安卓字段'
        // Subject: 'Test'
        // CreatedDate: new Date(2017,12,19)
      };
      wb.SheetNames.push('安卓字段1');
      // wb.SheetNames.push("安卓字段2");
      // wb.SheetNames.push("安卓字段3");
      // wb.SheetNames.push("安卓字段4");
      let ws = XLSX.utils.json_to_sheet(_contructJson(this.appstore));

      // let ws = XLSX.utils.json_to_sheet([{'应用名': this.appstore.ap1.appname.cont, '简单描述': this.appstore.ap0.simpleDesc.cont}]);
      wb.Sheets["安卓字段1"] = ws;

      let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      saveAs(
        new Blob([_s2ab(wbout)], { type: 'application/octet-stream' }),
        '安卓字段.xlsx'
      );
    },
    replaceKwSpliter() {
      for (let appIndex in this.appstore) {
        if (
          this.appstore[appIndex].keywords &&
          this.appstore[appIndex].keywords.counter > 0
        ) {
          this.appstore[appIndex].keywords.cont = this.appstore[
            appIndex
          ].keywords.cont
            .split(this.rule.kw.oldSpliter)
            .join(this.rule.kw.newSpliter);
        }
      }
    },
    onlyLenCheck(storeIndex, attr, str, minLen, maxLen, flag = false) {
      segLenCheck(this.appstore, storeIndex, attr, str, minLen, maxLen, flag);
    },
    sentenceCheck(storeIndex, str, maxLen, flag = false) {
      // oppo 不允许有标点和空格
      switch (storeIndex) {
        case 1:
          this.appstore.ap6.sentence.cont = this.appstore.ap1.sentence.cont;
          break;
        case 6:
          this.appstore.ap1.sentence.cont = this.appstore.ap6.sentence.cont;
          break;
        case 3:
          str = str.split(' ').join(''); // 先把空格去掉
          str = str.replace(engPunctuation, '').replace(chiPunctuation, ''); // 再把标点去掉
          this.appstore[`ap${storeIndex}`].sentence.cont = str;
          break;
        default:
          break;
      }

      // 通用和魅族共用字段
      if (storeIndex === 1 || storeIndex === 6) {
        segLenCheck(this.appstore, 1, 'sentence', str, 0, maxLen);
        segLenCheck(this.appstore, 6, 'sentence', str, 0, maxLen);
      } else {
        segLenCheck(this.appstore, storeIndex, 'sentence', str, 0, maxLen);
      }
    },
    keywordsCheck(storeIndex, str, maxLen) {
      // 华为要检查被空格分隔的个数，不能超过 4 个
      switch (storeIndex) {
        case 4:
          let kwLen = str.split(' ').length;
          if (kwLen > 4) {
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
      if (storeIndex === 5 || storeIndex === 6) {
        segLenCheck(this.appstore, 5, 'keywords', str, 0, maxLen);
        segLenCheck(this.appstore, 6, 'keywords', str, 0, maxLen);
      } else {
        segLenCheck(this.appstore, storeIndex, 'keywords', str, 0, maxLen);
      }
    },
    descCheck(storeIndex, str, minLen, maxLen) {
      // 应用宝需要检查广告法
      if (storeIndex === 7) {
        const adForbiddenArr = AdForbidden.split(',');
        for (const item of adForbiddenArr) {
          if (str.indexOf(item) >= 0) {
            this.appstore[`ap${storeIndex}`].desc.isErr = true;
            return false;
          }
        }
      }

      switch (storeIndex) {
        case 2:
        case 4:
        case 6:
          this.appstore.ap4.desc.cont = this.appstore.ap6.desc.cont = this.appstore.ap2.desc.cont;
          break;
        default:
          break;
      }

      // vivo 华为 魅族共用字段
      if (storeIndex === 2 || storeIndex === 4 || storeIndex === 6) {
        segLenCheck(this.appstore, 2, 'desc', str, minLen, maxLen);
        segLenCheck(this.appstore, 4, 'desc', str, minLen, maxLen);
        segLenCheck(this.appstore, 6, 'desc', str, minLen, maxLen)
      } else {
        segLenCheck(this.appstore, storeIndex, 'desc', str, minLen, maxLen)
      }
    }
  }
}
</script>
