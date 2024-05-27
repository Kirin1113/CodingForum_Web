<template>
  <div class="py-4 container-fluid">
    <infinite-scroll @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
      <div class="card">
        <div class="card-body p-3">
          <div class="row">
            <h4 v-if="posts.length == 0" style="text-align: center;">無符合條件之影片</h4>
            <div class="col-lg-3" v-for="post in posts" :key="post.id">
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
                  <div v-if="post.uva_topic.star == null" style="display: inline-block;">無</div>
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
                  <p class="card-text placeholder-glow">
                    作者 : 
                    <router-link class="" :to="{ name: 'Profile', params: { user_account: post.user_account } }">
                      {{ post.user_name }} </router-link>。
                    <timeago :datetime="post.created_at.replaceAll('/', '-')" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3" v-for="n in 8" v-show="loading">
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
    </infinite-scroll>
  </div>
</template>

<script>
import InfiniteScroll from "infinite-loading-vue3";
import {
  faHandPointer,
  faUsers,
  faCreditCard,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Dashboard",
  data() {
    return {
      iconBackground: "bg-gradient-success",
      faCreditCard,
      faScrewdriverWrench,
      faUsers,
      faHandPointer,
      posts: [],
      loading: true,
      noResult: false,
      message: "",
      more_lock: false,
      sort: '',
      star: [],
      code_type: [],
      send_serial: ''
    };
  },
  components: {
    InfiniteScroll
  },
  mounted() {
    this.loadDataFromServer()
  },
  methods: {
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
