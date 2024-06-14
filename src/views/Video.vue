<template>
  <infinite-scroll ref="test" @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-8 mb-4 mb-xxl-0">
          <el-main style="padding:0" v-loading="video_loading" element-loading-text="影片載入中"
            element-loading-background="rgba(0, 0, 0)">
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
                    CPE星數: <span v-for="star in post.uva_topic.star">⭐</span>
                    <div v-if="post.uva_topic.star == null" style="display: inline-block;">無</div> 。
                    語言: {{ post.code_type }}。
                  </div>
                  <div class="breakline"></div>
                  <timeago :datetime="post.created_at.replaceAll('/', '-')" v-if="post.length != 0" />。
                  <Vote @like_function="like_post" v-bind="{
                      post_id: post.id,
                      count: this.post_likes,
                      isLiked: this.isLiked,
                      isDisliked: this.isDisliked,
                      loading: this.loading,
                      type: 0//0post //1comment
                    }" />
                  <router-link style=" font-size: 13px;" v-if="token_user_id == post.user_id"
                    :to="{ name: 'EditPost', params: { post_id: post.id } }">
                    編輯影片</router-link>
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
              <soft-button color="info" full-width variant="gradient" class="mt-2 mb-2 mobileshow"
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
      <div class="row mt-4">
        <div class="col-md-4 col-12 mb-4 mobileshow" v-if="window.innerWidth < 1200">
          <div class="card">
            <div class="card-body p-3">
              <soft-button color="info" full-width variant="gradient" class="mt-2 mb-2 mobileshow"
                @click="showpdf = !showpdf">查看題目說明</soft-button>
              <soft-button v-if="post.length != 0 && showpdf" color="dark" full-width variant="gradient"
                class="mt-2 mb-2 mobileshow"
                @click="downloadpdf($global_url + 'proxy/get_uva_pdf/' + post.uva_topic.serial)">下載題目PDF</soft-button>
              <PDFViewer v-if="post.length != 0 && showpdf"
                :source="$global_url + 'proxy/get_uva_pdf/' + post.uva_topic.serial" style="height: 80vh;" ref="pdfviewer"
                @rendered="rendered" :controls="pdfcontrols" />
            </div>
          </div>
        </div>
        <div class="col-md-8 col-12">
          <div class="card">
            <div class="card-body p-3">
              <div class="mx-1 mx-xxl-4 mt-xxl-5">
                <div class="row mt-4">
                  <div class="col-2 col-xl-1 px-0" style="    text-align: center;">
                    <img class="userimg comment__avatar" :src="now_user_pic_url" alt="">
                  </div>
                  <div class="col-9 col-xl-10 px-0">
                    <CommentTextArea ref="postcomment" @newcomment="newcomment" :all_user="all_user" @click="checklogin"
                      :type=0 />
                  </div>
                  <div class="col-1 px-0">
                    <a class="btn btn-link text-dark px-3 mb-0" @click="$refs.postcomment.comment()">
                      <i class="fa-solid fa-paper-plane"></i>
                    </a>
                  </div>
                </div>
                <div v-for="(item, index) in comments" :key="item.id">
                  <Comment :id="'comment_' + item.id" @remove_comment="remove_comment" v-if="item.id != null" v-bind="{
                      picture: item.picture,
                      user_name: item.user_name,
                      user_account: item.user_account,
                      user_id: item.user_id,
                      content: item.content,
                      children_comment_count: item.children_comment_count,
                      children_comments: item.children_comments,
                      likes: item.likes,
                      comment_id: item.id,
                      created_at: item.created_at,
                      user_comment_like: user_comment_like,
                      all_user: all_user,
                      type: 1
                    }" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 pc" v-if="window.innerWidth > 1200">
          <div class="card">
            <div class="card-body p-3">
              <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                @click="downloadpdf($global_url + 'proxy/get_uva_pdf/' + post.uva_topic.serial)">下載題目PDF</soft-button>
              <PDFViewer v-if="post.length != 0" :source="$global_url + 'proxy/get_uva_pdf/' + post.uva_topic.serial"
                style="height: 80vh;" ref="pdfviewer" @rendered="rendered" :controls="pdfcontrols" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </infinite-scroll>
</template>

<script>
import { ElMessage } from "element-plus";
import { YoutubeVue3 } from 'youtube-vue3'
import Comment from "@/components/Comment.vue";
import CommentTextArea from "@/components/CommentTextArea.vue";
import Vote from "@/components/Vote.vue";
import InfiniteScroll from "infinite-loading-vue3";
import SoftButton from "../components/SoftButton.vue";
import PDFViewer from 'pdf-viewer-vue'
import download from 'downloadjs'

const axios = require('axios');

export default {
  name: "Billing",
  components: {
    YoutubeVue3,
    Comment,
    CommentTextArea,
    Vote,
    InfiniteScroll,
    PDFViewer,
    SoftButton
  },
  data() {
    return {
      post: [],
      uva_topic: [],
      post_id: this.$route.params.post_id,
      comment_id: this.$route.params.comment_id,
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
        post_id: this.post_id,
      }),
      () => {
        if (this.$route.name != 'Video') {
          return;
        }
        if (!this.post_id) {
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
    function get_post(post_id) {
      return axios
        .post("/api/forum/get_post", {
          post_id: post_id,
        });
    }
    function get_comment(post_id) {
      return axios
        .post("/api/forum/get_comment", {
          post_id: post_id,
        });
    }
    function get_like(post_id, token) {
      if (token) {
        return axios
          .post("/api/forum/get_like", {
            post_id: post_id,
          }, {
            headers: {
              'Authorization': `Bearer ` + token
            }
          });
      }
      else
        return ''
    }
    function get_all_user() {
      return axios
        .get("/api/auth/get_all_user", {
        });
    }
    function check_is_children_comment(comment_id) {
      return axios
        .post("/api/forum/check_is_children_comment", {
          comment_id: comment_id
        });
    }
    this.axios.all([get_post(this.post_id), get_comment(this.post_id), get_like(this.post_id, this.token), get_all_user(), check_is_children_comment(this.comment_id)]).then(
      this.axios.spread((res1, res2, res3, res4, res5) => {
        console.log(res4.data.success);
        this.all_user = res4.data.success;
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
        this.post_likes = res1.data.success.likes
        this.uva_topic = res1.data.success.uva_topic;
        if (this.comment_id != null) {
          if (!res5.data.success) //主留言
          {
            res2.data.success.forEach((item, index) => {
              if (this.comment_id == item.id) {
                this.comments.push(item);
                res2.data.success.splice(index, 1);
                return;
              };
            });
          } else {
            var parent_comment_id = res5.data.parent_comment_id;
            res2.data.success.forEach((item, index) => {
              if (parent_comment_id == item.id) {
                this.comments.push(item);
                res2.data.success.splice(index, 1);
                return;
              };
            });
          }
          this.comments = this.comments.concat(res2.data.success.slice(0, 3));
        } else {//無tag
          this.comments = res2.data.success.slice(0, 3);
        }
        if (res3 == '') {
          this.loading++
        }
        this.user_post_like = res3.data.user_post_like
        switch (this.user_post_like) {
          case null:
            this.isLiked = false;
            this.isDisliked = false;
            break;
          case 1:
            this.isLiked = true;
            this.isDisliked = false;
            break;
          case -1:
            this.isLiked = false;
            this.isDisliked = true;
            break;
          default:
            this.isLiked = false;
            this.isDisliked = false;
            break;
        }
        this.user_comment_like = res3.data.user_comment_like;
        this.loading++
      })
    )
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.status);
          ElMessage.error("影片不存在");
          that.$router.push({ name: 'Dashboard' });
        }
      }
      );
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
    remove_comment(comment_id) {
      console.log(comment_id)
      this.comments.forEach((comment, index) => {
        if (comment.id == comment_id) {
          this.comments.splice(index, 1);
        };
      });
    },
    newcomment(comment) {
      console.log(comment);
      this.comments.unshift(comment[0]);

    },
    onPlayed() {
    },
    like_post(dislike_or_like) {
      this.axios
        .post("/api/forum/like_post", {
          post_id: this.post_id,
          dislike_or_like: dislike_or_like,
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          this.user_post_like = res.data.user_post_like;
          switch (this.user_post_like) {
            case null:
              this.isLiked = false;
              this.isDisliked = false;
              break;
            case 1:
              this.isLiked = true;
              this.isDisliked = false;
              break;
            case -1:
              this.isLiked = false;
              this.isDisliked = true;
              break;
            default:
              this.isLiked = false;
              this.isDisliked = false;
              break;
          }
          this.loading++
        })
    },
    timelimit() {
      this.limit++;
    },
    async loadDataFromServer() {
      if (this.limit == 0)
        setTimeout(this.timelimit, 100);

      if (!this.more_lock && this.limit >= 1) {
        this.more_lock = true;
        if (!this.noResult) {
          await this.axios
            .post("/api/forum/get_comment", {
              post_id: this.post_id,
            })
            .then((res) => {
              let allsame = true;
              let newcommentcount = 0;
              console.log(res.data.success)
              res.data.success.forEach((item) => {
                if (newcommentcount == 6) return;
                let same = false;
                this.comments.forEach((comment) => {
                  if (comment.id == item.id) {
                    same = true;
                    return;
                  };
                });
                if (same == false) {
                  this.comments.push(item);
                  newcommentcount++;
                  allsame = false;
                }
              });
              if (allsame)
                this.noResult = true
            })
        }
        this.more_lock = false;
      }
    }
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