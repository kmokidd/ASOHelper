<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <form method="post" class="form" enctype="multipart/form-data">
      <section class="form-bd">
        <dl class="form-item">
          <dt class="form-item-hd title-item">请上传所有竞品ASO数据</dt>
          <dd class="form-item-bd">
            <section class="file-wrap" v-if="uplFileArr.length>0">
              <ul class="list-upl-file">
                <li class="item-upl-file" v-for="(f,i) in uplFileArr" :key="i">
                  <i class="icon icon-file"></i>
                  <span class="txt-with-icon">{{f.name}}</span>
                </li>
              </ul>
            </section>
            <section class="uploader">
              <section class="uploader-inner">
                <i class="icon-upload"></i>
                <span class="txt-with-icon">上传ASO数据</span>
              </section>
              <input type="file" name="file" id @change="uploadFile" multiple>
            </section>
          </dd>
        </dl>
      </section>
      <footer class="form-ft">
        <button class="btn btn-main btn-with-icon" @click="postData">提交分析</button>
      </footer>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "compete",
  data() {
    return {
      keywordsArr: [],
      isShow: false,
      isLoading: false,
      fd: new FormData(),
      uplFileArr: []
    };
  },
  components: {
    Loading
  },
  methods: {
    uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      // console.log(files);

      if (!files.length) return;

      // let fileArray = [];
      for (let key in files) {
        // this.uplFileArr.push(files[key]);
        console.log(parseInt(key));
        if (!isNaN(parseInt(key))) this.uplFileArr.push(files[key]);
      }
      console.log(this.uplFileArr);

      this.uplFileArr.forEach(file => {
        this.fd.append(`competitors`, file);
      });
    },
    postData(e) {
      e.preventDefault();
      const _self = this;

      // <--- 向后台请求处理部分
    }
  }
};
</script>

