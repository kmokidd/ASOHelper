<template>
  <div>
    <Loading v-if="isLoading"></Loading>

    <form method="post" enctype="multipart/form-data" class="form">
      <section class="form-bd">
        <dl class="form-item">
          <dt class="form-item-hd title-item">关键词</dt>
          <dd class="form-item-bd">
            <textarea
              class="form-textarea txt-cont"
              placeholder="关键词，用英文逗号分隔"
              name="kw"
              id
              cols="30"
              rows="10"
              v-model="keywords"
            ></textarea>
          </dd>
        </dl>
        <dl class="form-item">
          <dt class="form-item-hd title-item">数据上传</dt>
          <dd class="form-item-bd">
            <section class="file-wrap" v-if="uplFileArr.length>0">
              <ul class="list-upl-file">
                <li class="item-upl-file" v-for="(f,i) in uplFileArr" :key="i">
                  <i class="icon icon-file"></i>
                  <span class="txt-with-icon">{{f.name}}</span>
                </li>
              </ul>
              <b class="uploader">
                <span class="txt-link">重新上传</span>
                <input type="file" name="file" id @change="uploadFile">
              </b>
            </section>

            <section class="uploader" v-else>
              <section class="uploader-inner">
                <i class="icon-upload"></i>
                <span class="txt-with-icon">上传ASO数据</span>
              </section>
              <input type="file" name="file" id @change="uploadFile">
            </section>
          </dd>
        </dl>
      </section>
      <footer class="form-ft">
        <button class="btn btn-main btn-with-icon" @click="postData1">提交分析</button>
      </footer>
    </form>

    <section class="result" v-show="isShow">
      <section class="result-item">
        <h3 class="title-item">建议保留</h3>
        <span
          v-for="(keyword,i) in decidedKw"
          :key="i"
          class="txt-cont"
          :style="'color:' + keyword.color"
        >{{keyword.title}},</span>
      </section>
      <section class="result-item" v-if="consideredKw.length>0">
        <h3 class="title-item">建议组词/拆词/删除</h3>
        <ul class="list">
          <li class="txt" v-for="(keyword,i) in consideredKw" :key="i">
            <!-- <p class="txt-cont"><a class="link" :href="'#'+keyword.title" :style="'color:' + keyword.color">{{keyword.title}}</a>，表现平平，来看看其他词吧</p> -->
            <p class="txt-cont">{{keyword.title}}，表现平平，来看看其他词吧</p>
            <table v-if="keyword.betterWords.length>0">
              <thead>
                <tr>
                  <th>关键词</th>
                  <th>排名</th>
                  <th>变化</th>
                  <th>热度</th>
                  <th>搜索结果数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(word,i) in keyword.betterWords" :key="i">
                  <td>{{word.keyword}}</td>
                  <td>{{word.data[0]}}</td>
                  <td>{{word.data[1]}}</td>
                  <td>{{word.data[2]}}</td>
                  <td>{{word.data[3]}}</td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<style lang="less">
// @import "~@/styles/form.module.less";
</style>


<script>
import Loading from "@/components/Loading.vue";

let DATA = {};

const width = 680,
  height = 800;

export default {
  name: "index",
  data() {
    return {
      keywords: "",
      isShow: false,
      isLoading: false,
      decidedKw: {},
      consideredKw: {},
      form: new FormData(),
      uplFileArr: []
    };
  },
  components: {
    Loading
  },
  methods: {
    uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      this.form.set("file", files[0]);

      if (this.uplFileArr.length > 0) {
        this.uplFileArr.splice(0, this.uplFileArr.length);
      }
      this.uplFileArr.push({ name: files[0].name });
    },
    postData1(e) {
      e.preventDefault();
      // 每次点击的时候，先清空结果
      // $('#svg-wrapper').empty();
      this.isLoading = true;

      console.log(`keywords is ${this.keywords}`);
      this.form.set("kw", this.keywords);
      const _self = this;


      // <--- 向后台请求处理部分
    }
  }
};
</script>