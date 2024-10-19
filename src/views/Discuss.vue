<template>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <el-main style="padding:0" v-loading="post_check" element-loading-text="發表中"
            element-loading-background="rgb(248 248 248)">
            <div class="card z-index-0">
              <div class="card-body">
                <form role="form" @submit.prevent="post" class="mx-auto col-xl-9">
                  <div class="mb-3">
                    <label>*標題</label>
                    <input class="form-control" v-model="title" id="title" type="text" placeholder="請輸入標題(限30字以內)"
                      required />
                  </div>
                  <div class="mb-3">
                    <label>*內容</label>
                    <textarea class="form-control" id="content" v-model="content" rows="5" placeholder="請輸入內容"
                      required></textarea>
                  </div>
                  <div class="text-center">
                    <soft-button color="warning" full-width variant="gradient" class="my-4 mb-2"
                      :disabled="post_check">發表</soft-button>
                    <soft-button color="dark" full-width variant="gradient" class="mb-5 mt-5"
                      @click.stop.prevent="$router.go(-1)">取消</soft-button>
                  </div>
                </form>
              </div>
            </div>
          </el-main>
        </div>
      </div>
    </div>
  </template>
  
<script>
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
  
export default {
    name: "Discuss",
    components: {
      SoftButton,
    },
    data() {
      return {
        title: '',
        content: '',
        token: this.$cookies.get("token"),
        post_check: false
      };
    },
    methods: {
      post() {
        if (!this.token) {
          ElMessage.error("請先登入以進行操作");
          this.$router.push({ name: 'Sign In' });
        }
        const that = this
        this.post_check = true
        this.axios
        .post("/api/forum/community", {
            title: this.title,
            content: this.content,
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
                message: "上傳成功",
                type: "success",
                duration: 3000,
            });
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response);
                that.post_check = false
                ElMessage.error(error.response.data.error);
            }
        });
      }
    },
}
</script>