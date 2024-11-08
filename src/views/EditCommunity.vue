<template>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card z-index-0">
            <div class="card-body">
              <form role="form" class="mx-auto col-xl-9">
                <div class="mb-3">
                    <label>*標題</label>
                    <input class="form-control" v-model="title" id="title" type="text" placeholder="請輸入文章標題(限30字以內)"
                      required />
                </div>
                <div class="mb-3">
                  <label>*內容</label>
                  <textarea class="form-control" id="content" v-model="content" rows="5" placeholder="請輸入文章內容"
                    required></textarea>
                </div>
                <div class="text-center">
                  <soft-button color="warning" full-width variant="gradient" class="mt-2 mb-2" @click.stop.prevent="community()">更新
                    </soft-button>
                  <soft-button color="dark" full-width variant="gradient" class="mb-5"
                    @click.stop.prevent="$router.go(-1)">取消</soft-button>
                  <soft-button color="danger" full-width variant="gradient" class="mt-5" data-bs-toggle="modal"
                    :data-bs-target="'#staticBackdropCommunity' + community_id" @click.stop.prevent="">刪除文章</soft-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" :id="'staticBackdropCommunity' + community_id" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">是否確認要刪除這篇文章</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
              @click.stop.prevent="delcommunity()">確定</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SoftButton from "@/components/SoftButton.vue";
  import { ElMessage } from "element-plus";
  
  export default {
    name: "EditCommunity",
    components: {
      SoftButton,
    },
    data() {
      return {
        community_id: this.$route.params.community_id,
        temp: '',
        title: '',
        content: '',
        token: this.$cookies.get("token"),
        token_user_account: this.$cookies.get("account"),
      };
    },
    created() {
      this.$watch(
        () => ({
            community_id: this.community_id,
        }),
        () => {
          if (this.$route.name != 'EditCommunity') {
            return;
          }
          if (!this.community_id) {
            this.$router.push({ name: 'Comminicate' });
          }
          this.axios
            .post("/api/forum/get_community", {
                community_id: this.community_id
            })
            .then((res) => {
              console.log(res)
              this.title = res.data.success.title
              this.content = res.data.success.content
            })
        },
        { deep: true, immediate: true }
      );
    },
    methods: {
      community() {
        if (!this.token) {
          ElMessage.error("請先登入以進行操作");
          this.$router.push({ name: 'Sign In' });
        }
        this.axios
          .post("/api/forum/community", {
            title: this.title,
            content: this.content,
            community_id: this.community_id
          }, {
            headers: {
              'Authorization': `Bearer ` + this.token
            }
          })
          .then((res) => {
            console.log(res);
            this.$router.push({
                name: 'Community', params: { community_id: res.data.community_id }
            });
            ElMessage({
                message: res.data.success,
                type: "success",
                duration: 3000,
            });
          })
          .catch(function (error) {
            if (error.response) {
                console.log(error.response);
                if (error.response.status == 402) {
                    ElMessage.error(error.response.data.error);
                }
            }
          });
      },
      delcommunity() {
        if (!this.token) {
          ElMessage.error("請先登入以進行操作");
          this.$router.push({ name: 'Sign In' });
        }
        this.axios
          .post("/api/forum/del_community", {
            community_id: this.community_id
          }, {
            headers: {
              'Authorization': `Bearer ` + this.token
            }
          })
          .then((res) => {
            console.log(res);
            this.$router.push({ name: 'Comminicate' });
            ElMessage({
              message: "刪除成功",
              type: "success",
              duration: 3000,
            });
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response);
              if (error.response.status == 402) {
                ElMessage.error(error.response.data.error);
              }
            }
          });
      },
    },
  }
  </script>
  
  <style >
  .el-select-dropdown__item {
    width: 300px;
    width: 100%;
  }
  
  .el-select {
    display: block !important;
  }
  
  .codemirror-container {
    display: block;
  }
  </style>
  
  <style scoped>
  @media (min-width: 1200px) {
    .video_pic {
      width: 20%;
    }
  }
  
  @media (max-width: 1200px) {
    .video_pic {
      width: 100%;
    }
  }
  </style>