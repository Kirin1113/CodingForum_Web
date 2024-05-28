<template>
  <div class="container-fluid">
    <div class="mt-4 page-header cover_height border-radius-xl" :style="{
      backgroundImage:
        'url(' + $global_url + user.cover + ')',
      backgroundPositionY: '50%',
    }" v-if="user">
    </div>
    <div class="mx-4 overflow-hidden card card-body blur shadow-blur user_cover">
      <div class="row gx-4">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img v-if="user" :src="$global_url + user.picture" alt="" class="shadow-sm w-100 border-radius-lg" />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">{{ user.name }}</h5>
            <p class="logout" @click="logout" v-if="token_user_account == this.$route.params.user_account" >登出</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="pb-4 container-fluid">
    <infinite-scroll @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
      <div class="mt-xl-3 row">
        <!-- 個人介紹 -->
        <div class="mt-4 col-12 col-md-4 col-xl-4 mt-md-0">
          <div class="card h-100">
            <div class="p-3 pb-0 card-header">
              <div class="row">
                <div class="edit_button">
                  <a>
                    <router-link class="ms-2" style="font-size: 13px;" :to="{ name: 'EditUser' }"
                      v-if="token_user_account == this.$route.params.user_account">
                      編輯個資</router-link>
                    <router-link class="ms-2" style="font-size: 13px;" :to="{ name: 'EditPic' }"
                      v-if="token_user_account == this.$route.params.user_account">
                      編輯頭貼</router-link>
                    <router-link class="ms-2" style="font-size: 13px;" :to="{ name: 'EditCover' }"
                      v-if="token_user_account == this.$route.params.user_account">
                      編輯封面</router-link>
                    <router-link class="ms-2" style="font-size: 13px;" :to="{ name: 'EditPassword' }"
                      v-if="token_user_account == this.$route.params.user_account">
                      修改密碼</router-link>
                  </a>
                </div>
                <div class="d-flex align-items-center">
                  <h6 class="mb-0">個人資訊</h6>
                </div>
              </div>
            </div>
            <div class="p-3 card-body">
              <p class="text-sm">
                {{ user.intro }}
              </p>
              <ul class="list-group">
                <li class="text-sm border-0 list-group-item ps-0">
                  <strong class="text-dark">電子郵件:</strong> &nbsp; {{ user.email }}
                </li>
                <li v-if="social.length != 0" class="pb-0 border-0 list-group-item ps-0">
                  <strong class="text-sm text-dark">社群媒體:</strong> &nbsp;
                  <a v-for="({ link, iconclass }, index) of social" :key="index" class="py-0 mb-0 btn-simple ps-1 pe-2"
                    :href="link">
                    <i :class=iconclass></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 影片 -->
        <div class="mt-4 col-12 col-md-8 col-xl-8 mt-md-0">
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <h4 v-if="posts.length == 0" style="text-align: center;">尚未有影片</h4>
                <div class="col-lg-4" v-for="post in posts" :key="post.id">
                  <div class="card mb-2" aria-hidden="true">
                    <div style="overflow: hidden;">
                      <router-link :to="{ name: 'Video', params: { post_id: post.id } }"><img
                          class="card-img-top youtube_img_fix" :src="post.video_pic_url" alt=""></router-link>
                    </div>
                    <div class=" card-body" style="    text-align: center;">
                      <h5 class="card-title placeholder-glow">
                        {{ post.uva_topic.serial + "-" + post.uva_topic.title }}
                      </h5>
                      <p>CPE星數: <span v-for="star in post.uva_topic.star">⭐</span>
                      <div v-if="post.uva_topic.star == null" style="    display: inline-block;">無</div>
                      <br>
                      語言: {{ post.code_type }}
                      <br>
                      愛心數:
                      <div class="vote__count" :class="[{ positive: post.likes > 0 }, { negative: post.likes < 0 },]"
                        style="display: inline;">
                        <span class="vote__count-n">
                          <i :class="post.likes >= 0 ? 'fa-solid fa-heart' : 'fa-solid fa-heart-broken'"></i> x {{ post.likes }}
                        </span>
                      </div>
                      <br>
                      留言數: {{ post.comments_count }}
                      </p>
                      {{ post.created_at }}
                      <router-link class="ms-3" style=" font-size: 13px;" v-if="token_user_id == post.user_id"
                        :to="{ name: 'EditPost', params: { post_id: post.id } }">
                        編輯影片</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4" v-for="n in 6" v-show="loading">
                  <div class="card mb-2" aria-hidden="true">
                    <img src="@\assets\img\loadingbak.jpg" class="card-img-top" alt="">
                    <div class="card-body">
                      <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                      </h5>
                      <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </infinite-scroll>
  </div>
</template>

<script>
import InfiniteScroll from "infinite-loading-vue3";
import { ElMessage } from "element-plus";
import SoftButton from "../components/SoftButton.vue";

export default {
  name: "ProfileOverview",
  components: {
    InfiniteScroll,
    SoftButton
  },
  data() {
    return {
      showMenu: false,
      user: [],
      token: '',
      self: 0,
      posts: [],
      loading: true,
      page: 1,
      noResult: false,
      message: "",
      social: [],
      more_lock: false,
      token: this.$cookies.get("token"),
      token_user_id: this.$cookies.get("user_id"),
      token_user_account: this.$cookies.get("user_account"),
      sort: '',
      star: [],
      code_type: [],
      send_serial: ''
    };
  },
  created() {
    const that = this;
    this.$watch(
      () => ({
        user_account: this.$route.params.user_account
      }),
      () => {
        if (this.$route.name != 'Profile') {
          return;
        }
        if (!this.$route.params.user_account) {
          this.$router.push({ name: 'Dashboard' });
          ElMessage.error("用戶不存在");
          return;
        }
        this.posts = [];
        this.loading = true;
        this.page = 1;
        this.noResult = false;
        this.message = "";
        this.social = [];
        if (this.$cookies.isKey("token")) {
          this.token = this.$cookies.get("token")
        }
        this.axios
          .post("/api/auth/user", {
            account: this.$route.params.user_account
          }, {
            headers: {
              'Authorization': `Bearer ` + this.token
            }
          })
          .then((res) => {
            this.user = res.data.user
            this.self = res.data.self

            if (this.user.github != null) {
              this.social.push({ link: this.user.github, iconclass: "fa-brands fa-github" })
            }
          }).catch(function (error) {
            if (error.response) {
              that.$router.push({ name: 'Dashboard' });
              ElMessage.error("用戶不存在");
            }
          });
        this.loadDataFromServer()
      },
      { deep: true, immediate: true }
    );
  },
  methods: {
    logout() {
      this.axios
        .post("/api/auth/logout", {
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        }).then((res) => {
          this.$router.go()
          this.$cookies.remove("token")
          this.$cookies.remove("user_account")
          this.$cookies.remove("user_id")
          this.$cookies.remove("now_user_pic_url")
          this.$cookies.remove("isadmin")
          ElMessage({
            message: "登出成功",
            type: "success",
            duration: 3000,
          });
        })
    },
    resetpost() {
      this.send_serial = ''
      this.posts = [];
      this.noResult = false
      this.loadDataFromServer()
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    changepost(options) {
      console.log('type ' + options.type)
      if (options.type <= 5) {
        this.sort = options.type;
      } else if (options.type == 6) {
        this.star = [];
      }
      else if (options.type == 7) {
        if (!this.star.includes(null))
          this.star.push(null);
        else {
          this.star.forEach((star, index) => {
            if (star == null) {
              this.star.splice(index, 1);
            };
          });
        }
      }
      else if (options.type >= 8 && options.type <= 12) {
        if (!this.star.includes(options.type - 7))
          this.star.push(options.type - 7)
        else {
          this.star.forEach((star, index) => {
            if (star == options.type - 7 || star == null) {
              this.star.splice(index, 1);
            };
          });
        }
      } else if (options.type == 13) {
        this.code_type = []
      }
      else if (options.type >= 14 && options.type <= 17) {
        if (!this.code_type.includes(options.type))
          this.code_type.push(options.type)
        else {
          this.code_type.forEach((code_type, index) => {
            if (code_type == options.type) {
              this.code_type.splice(index, 1);
            };
          });
        }
      }
      else if (options.type == 99) {
        console.log(options.select_uva)
        this.send_serial = options.select_uva.serial
      }
      this.posts = [];
      this.noResult = false
      this.loadDataFromServer()
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    async loadDataFromServer() {
      if (!this.more_lock) {
        this.more_lock = true;
        if (!this.noResult) {
          this.loading = true;
          await this.axios
            .post("/api/forum/get_post", {
              code_type: this.code_type,
              star: this.star,
              sort: this.sort,
              user_account: this.$route.params.user_account,
              serial: this.send_serial
            })
            .then((res) => {
              let allsame = true;
              let newpostcount = 0;
              console.log(res.data.success)
              res.data.success.forEach((item) => {
                if (newpostcount == 8) return;
                let same = false;
                this.posts.forEach((post) => {
                  if (post.id == item.id) {
                    same = true;
                    return;
                  };
                });
                if (same == false) {
                  this.posts.push(item);
                  newpostcount++;
                  allsame = false;
                }
              });
              if (allsame)
                this.noResult = true
            })
        }
        this.loading = false;
        this.more_lock = false;
      }
    }
  },
};
</script>

<style scoped>
@media (min-width: 1200px) {
  .user_cover {
    margin-top: -0.5rem !important;
    margin-bottom: 2rem !important;
  }

  .cover_height {
    min-height: 300px !important;
  }

  .edit_button {
    text-align: end !important;
  }
}

@media (max-width: 1200px) {
  .user_cover {
    margin-top: 1rem !important;
  }

  .cover_height {
    height: 7vh;
  }

  .edit_button {
    text-align: center !important;
  }
}
</style>

<style>
.logout {
  cursor: pointer;
}

.logout:hover {
  color: #830866;
}
</style>