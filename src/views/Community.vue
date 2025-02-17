<template>
  <infinite-scroll ref="test" @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-8 mb-4 mb-xxl-0">
          <div class="card">
            <div class="card-body">
              <div class="card-body d-flex flex-column justify-content-between">
                <!-- Title at the top -->
                <div class="title_font mb-3">
                  {{ community.title }}
                </div>
                
                <!-- Content in the middle -->
                <div class="mt-2 flex-grow-1">
                  <textarea class="form-control" id="content" v-model="community.content" rows="4" readonly></textarea>
                </div>
                
                <!-- User details at the bottom -->
                <div class="comment__author mt-3 d-flex align-items-center" style="align-self: flex-start;" v-if="community.length != 0">
                  <img class="userimg comment__avatar" :src="$global_url + community.user_picture" alt="" />
                  <h3 class="comment__title ms-2" style="margin:0">
                    <router-link :to="{ name: 'Profile', params: { user_account: community.user_account } }">
                      {{ community.user_name }} 
                    </router-link>
                  </h3>
                  <div v-if="token_user_id != community.user_id" @click="follow_author(isFollow ? 0 : 1)">
                    <div v-if="isFollow" style="cursor: pointer;" class="cancel-subscribe-button">
                      <i class="fa-solid fa-square-plus"></i>取消關注
                    </div>
                    <div v-if="!isFollow" style="cursor: pointer;" class="subscribe-button">
                      <i class="fa-regular fa-square-plus"></i>關注
                    </div>
                  </div>
                  <i class="fa-solid fa-eye"></i> x {{ community.views }}
                  <Vote @like_function="like_community" v-bind="{
                      community_id: community.id,
                      count: this.community_likes,
                      isLiked: this.isLiked,
                      isDisliked: this.isDisliked,
                      loading: this.loading,
                      type: 0//0video //1comment
                    }" />
                  <router-link v-if="token_user_id == community.user_id" 
                               class="ms-3" 
                               style="font-size: 13px;" 
                               :to="{ name: 'EditCommunity', params: { community_id: community.id } }">
                    <div style="cursor: pointer"  data-bs-toggle="tooltip" title="編輯文章">
                      <i class="fa-solid fa-pen"></i>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-8" style="overflow-y: auto;">
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
      </div>
    </div>
  </infinite-scroll>
</template>

<script>
import { ElMessage } from "element-plus";
import Comment from "@/components/Comment.vue";
import CommentTextArea from "@/components/CommentTextArea.vue";
import Vote from "@/components/Vote.vue";
import InfiniteScroll from "infinite-loading-vue3";
import SoftButton from "../components/SoftButton.vue";

const axios = require('axios');

export default {
  name: "Community",
  components: {
    Comment,
    CommentTextArea,
    Vote,
    InfiniteScroll,
    SoftButton
  },
  data() {
    return {
      community: [],
      community_id: this.$route.params.community_id,
      user_id: this.$cookies.get("user_id"),
      comment_id: this.$route.params.comment_id,
      loading: 0,
      comments: [],
      user_community_like: 0,
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
      isFollow: false,
      user_follow_author: 0,
      author_id: '',
    };
  },
  created() {
    this.$watch(
      () => ({
        community_id: this.community_id,
      }),
      () => {
        if (this.$route.name != 'Community') {
          return;
        }
        if (!this.community_id) {
          this.$router.push({ name: 'Comminicate' });
        }
      },
      { deep: true, immediate: true }
    );
  },
  mounted() {
    if (this.$cookies.isKey("now_user_pic_url"))
      this.now_user_pic_url = this.$cookies.get("now_user_pic_url")
    const that = this;
    function get_community(community_id) {
      return axios
        .post("/api/forum/get_community", {
          community_id: community_id,
        });
    }
    function get_comment(community_id) {
      return axios
        .post("/api/forum/get_comment", {
          community_id: community_id,
        });
    }
    function get_like(community_id, token) {
      if (token) {
        return axios
          .post("/api/forum/get_like", {
            community_id: community_id,
          }, {
            headers: {
              'Authorization': `Bearer ` + token
            }
          });
      }
      else
        return ''
    }
    function get_follow(author_id, token) {
      if (token) {
        return axios
          .post("/api/forum/get_follow", {
            author_id: author_id,
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
    this.axios.all([get_community(this.community_id), get_comment(this.community_id), get_like(this.community_id, this.token), get_all_user(), check_is_children_comment(this.comment_id)]).then(
      this.axios.spread((res1, res2, res3, res4, res5) => {
        console.log(res4.data.success);
        this.all_user = res4.data.success;
        console.log(res1);
        this.community = res1.data.success;
        this.author_id = res1.data.success.user_id;
        this.community_likes = res1.data.success.likes;
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
        this.user_community_like = res3.data.user_community_like
        switch (this.user_community_like) {
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
        this.loading++;
        this.axios.all([get_follow(this.author_id, this.token)]).then(
          this.axios.spread((res6) => {
            this.user_follow_author = res6.data.user_follow_author
            switch (this.user_follow_author) {
              case null:
                this.isFollow = false;
                break;
              case 1:
                this.isFollow = true;
                break;
              default:
                this.isFollow = false;
                break;
            }
          })
        )
      })
    )
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.status);
        // ElMessage.error("文章不存在");
        that.$router.push({ name: 'Comminicate' });
      }
    });
    console.log(this.$refs.test)
  },
  methods: {
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
    follow_author(follow) {
      this.checklogin();

      this.axios
      .post("/api/forum/follow_author", {
        author_id: this.author_id,
        follow: follow,
      }, {
        headers: {
          'Authorization': `Bearer ` + this.token
        }
      })
      .then((res) => {
          this.user_follow_author = res.data.user_follow_author;
          this.isFollow = this.user_follow_author === 1;
      })
    },
    like_community(dislike_or_like) {
      this.axios
        .post("/api/forum/like_community", {
          community_id: this.community_id,
          dislike_or_like: dislike_or_like,
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          this.user_community_like = res.data.user_community_like;
          switch (this.user_community_like) {
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
              community_id: this.community_id,
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

  .subscribe-button {
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background-color: red;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.subscribe-button:hover {
  background-color: red;
  transform: scale(1.05);
}

.cancel-subscribe-button {
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background-color: gray;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cancel-subscribe-button:hover {
  background-color: gray;
  transform: scale(1.05);
}
</style>