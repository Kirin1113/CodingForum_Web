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
                    點擊次數: <i class="fa-solid fa-eye"></i> x {{ post.views }}
                    <br>
                    按讚數:
                    <div class="vote__count" :class="[{ positive: post.likes > 0 }, { negative: post.likes < 0 },]"
                      style="display: inline;">
                      <span class="vote__count-n">
                        <i :class="post.likes >= 0 ? 'fa fa-thumbs-up' : 'fa fa-thumbs-down'"></i> x {{ post.likes }}
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
  
  export default {
    name: "MyWatch",
    data() {
      return {
        posts: [],
        loading: true,
        noResult: false,
        message: "",
        more_lock: false,
        send_author_id: ''
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
        this.send_author_id = ''
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
        if (options.type == 99) {
          console.log(options.author_id)
          this.send_author_id = options.author_id
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
            try {
              const res = await this.axios.post("/api/forum/get_post_view", {
                author_id: this.send_author_id
              }, {
                headers: {
                  'Authorization': `Bearer ${this.$cookies.get("token")}`
                }
              });
  
              if (res.data && Array.isArray(res.data.success)) {
                let newPosts = res.data.success.filter(item => !this.posts.some(post => post.id === item.id));
                this.posts = [...this.posts, ...newPosts.slice(0, 8)];
                if (newPosts.length === 0) {
                  this.noResult = true;
                }
              } else {
                console.error("Unexpected response format:", res.data);
              }
            } catch (error) {
              console.error("Error loading data:", error);
              // Handle error state
            }
          }
          this.loading = false;
          this.more_lock = false;
        }
      }
  
    },
  };
  </script>
  