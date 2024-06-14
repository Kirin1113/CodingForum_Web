<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-lg-8 mb-4 mb-xxl-0">
        <el-main style="padding:0" v-loading="video_loading" element-loading-text="影片載入中"
          element-loading-background="rgba(0, 0, 0)">
          <router-link :to="{ name: 'Video', params: { post_id: post.post_id } }">
            <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2">
              查看原始影片</soft-button>
          </router-link>
          <h4 style="text-align: center;">此畫面為作業暫存<br>為作業批改用<br>為學生在作業繳交期限內之影片</h4>
          <div class="container_video" style="background-color: black;">
            <YoutubeVue3 ref="youtube" :videoid="post.video_id" :controls="1" class="youtub" @played="onPlayed" />
          </div>
          <div class="card">
            <div class="card-body">
              <div class="title_font mb-3">
                {{ uva_topic.show }}
              </div>
              <div class="comment__author " style="align-self: flex-start;" v-if="post.length != 0">
                <img class="userimg comment__avatar " :src="$global_url + post.user_picture" alt="" />
                <h3 class="comment__title" style="margin:0">
                  <router-link class="" :to="{ name: 'Profile', params: { user_account: post.user_account } }">
                    {{ post.user_name }} </router-link>
                </h3>
                <div v-if="post.length != 0">
                  CPE星數: <i class="fa-solid fa-star-of-david" v-for="star in post.uva_topic.star"></i>
                  <div v-if="post.uva_topic.star == null" style="    display: inline-block;">無</div> 。
                  語言: {{ post.code_type }}。
                </div>
                <div class="breakline"></div>
              </div>
              <div class="mt-2">
                <textarea class="form-control" id="content" v-model="post.content" rows="4" readonly></textarea>
              </div>
            </div>
          </div>
        </el-main>
      </div>
      <div class="col-lg-4">
        <div class="card" style="height: 100%;">
          <div class="card-body p-3">
            <div class="mb-3">
              <label>程式語言</label>
              <el-select v-model="post.code_editor_type" class="" placeholder="請選擇程式語言" disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2 mobileshow"
              @click="showcode = !showcode">查看程式碼</soft-button>
            <div class="mb-3 pc">
              <label>程式碼</label>
              <Codemirror v-model:value="post.code" :options="cmOptions" border ref="cmRef" height="600" width="100%"
                @change="onChange" @input="onInput" @ready="onReady" :key="selete_loading">
              </Codemirror>
            </div>
            <div class="mb-3 mobileshow" v-if="showcode">
              <label>程式碼</label>
              <Codemirror v-model:value="post.code" :options="cmOptions" border ref="cmRef" height="600" width="100%"
                @change="onChange" @input="onInput" @ready="onReady" :key="selete_loading">
              </Codemirror>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { YoutubeVue3 } from 'youtube-vue3'
import SoftButton from "../components/SoftButton.vue";
import download from 'downloadjs'

const axios = require('axios');

export default {
  name: "Billing",
  components: {
    YoutubeVue3,
    SoftButton
  },
  data() {
    return {
      post: [],
      uva_topic: [],
      temp_post_id: this.$route.params.temp_post_id,
      video_loading: true,
      loading: 0,
      comments: [],
      user_post_like: 0,
      user_comment_like: [],
      token: this.$cookies.get("token"),
      token_user_id: this.$cookies.get("user_id"),
      now_user_pic_url: this.$global_default_pic_url,
      isLiked: false,
      isDisliked: false,
      noResult: false,
      message: "",
      more_lock: false,
      limit: 0,
      all_user: [],
      options: [{ value: 'text/x-csrc', label: 'C' }, { value: 'text/x-c++src', label: 'C++' }, { value: 'text/x-java', label: 'Java' }, { value: 'python', label: 'Python' }],
      code_type: 'text/x-csrc',
      selete_loading: 0,
      cmOptions: {
        mode: 'text/x-csrc', // Language mode
        theme: 'lucario', // Theme
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autofocus: true,
        readOnly: true,
      },
      showcode: false,
      showpdf: false,
      pdfcontrols: [
        'print',
        'rotate',
        'zoom',
        'switchPage',
      ]
    };
  },
  created() {
    this.$watch(
      () => ({
        temp_post_id: this.temp_post_id,
      }),
      () => {
        if (this.$route.name != 'TempVideo') {
          return;
        }
        if (!this.temp_post_id) {
          this.$router.push({ name: 'Dashboard' });
        }
      },
      { deep: true, immediate: true }
    );
  },
  mounted() {
    if (this.$cookies.isKey("now_user_pic_url"))
      this.now_user_pic_url = this.$cookies.get("now_user_pic_url")
    const that = this;
    function get_post(temp_post_id) {
      return axios
        .post("/api/forum/get_temp_post", {
          temp_post_id: temp_post_id,
        });
    }
    this.axios.all([get_post(this.temp_post_id)]).then(
      this.axios.spread((res1) => {
        console.log(res1);
        this.post = res1.data.success;
        if (this.post.code == null) {
          this.post.code = ''
        }
        this.cmOptions = {
          mode: this.post.code_editor_type, // Language mode
          theme: 'lucario', // Theme
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          lineWrapping: true,
          matchBrackets: true,
          autofocus: true,
          readOnly: true,
        }
        this.video_loading = false;
        this.uva_topic = res1.data.success.uva_topic;
        this.loading++
      })
    )
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.status);
          ElMessage.error("影片不存在");
          that.$router.push({ name: 'Dashboard' });
        }
      });
    console.log(this.$refs.test)
  },
  methods: {
    downloadpdf(url) {
      ElMessage({
        message: "請稍等，正在準備下載",
        type: "success",
        duration: 3000,
      });
      download(url);
    },
    rendered() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          console.log("12222")
          console.log(this.$refs.pdfviewer)
          this.$refs.pdfviewer.handleToggleFullpage()
        });
      });
    },
    checklogin() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$cookies.set("go_login_then_backpost", this.post_id, "3min");
        this.$router.push({ name: 'Sign In' });
      }
    },
  },
};
</script>

<style scoped>
.comment__author {
  flex-wrap: wrap;
}

.boss {
  margin-top: 100px;

}

@media (min-width: 1200px) {
  .title_font {
    font-size: 1.4rem;
  }


}

@media (max-width: 1200px) {
  .title_font {
    font-size: 1.3rem;
  }
}

.form-control:disabled,
.form-control[readonly] {
  background-color: #ffffff00;
}

textarea {
  cursor: default;
  border: #ffffff00;
}

textarea:focus {
  border-color: #d2d6da;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.075) inset, 0 0 0px #d2d6da;
  outline: 0 none;
}

#textbox {
  width: 100vw;
  height: 100vh;
}
</style>

<style>
.tagcolor {
  background-color: #e9f1ff;
  border-radius: 15px;
  animation-name: example;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes example {
  from {
    background-color: #e9f1ff;
  }

  50% {
    background-color: #6294ff46;
  }

  to {
    background-color: #e9f1ff;
  }
}
</style>