<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">

          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <label>Email</label>
                <input class="form-control" v-model="email" type="text" placeholder="請輸入信箱" required />
              </div>
              <div class="mb-3">
                <label>中文姓名</label>
                <input class="form-control" v-model="name" type="text" placeholder="請輸入信箱" required />
              </div>
              <div class="mb-3">
                <label>自我介紹</label>
                <textarea class="form-control" v-model="intro" rows="5" placeholder="Hi,I'm XXX"></textarea>
              </div>

              <div class="mb-3">
                <label>github</label>
                <input class="form-control" v-model="github" type="text" placeholder="請貼入網址" />
              </div>

              <div class="mb-3">
                <label>instagram</label>
                <input class="form-control" v-model="instagram" type="text" placeholder="請貼入網址" />
              </div>

              <div class="mb-3">
                <label>facebook</label>
                <input class="form-control" v-model="facebook" type="text" placeholder="請貼入網址" />
              </div>

              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                  @click.stop.prevent="edit()">更新</soft-button>

                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                  @click.stop.prevent="$router.go(-1)">取消</soft-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";


export default {
  name: "EditPost",
  components: {
    SoftButton,
  },
  data() {
    return {
      upload_userpic: '上傳頭貼',
      temp: '',
      email: '',
      name: '',
      intro: '',
      github: '',
      instagram: '',
      facebook: '',
      token: this.$cookies.get("token"),
      token_user_id: this.$cookies.get("user_id"),
      token_user_account: this.$cookies.get("user_account"),
      user: [],
    };
  },
  created() {
    this.axios
      .post("/api/auth/token_user", {
      }, {
        headers: {
          'Authorization': `Bearer ` + this.token
        }
      })
      .then((res) => {

        console.log(res);
        this.email = res.data.user.email
        this.name = res.data.user.name
        this.intro = res.data.user.intro
        this.github = res.data.user.github
        this.instagram = res.data.user.instagram
        this.facebook = res.data.user.facebook
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

  methods: {
    edit() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      this.axios
        .post("/api/auth/edit_user", {
          email: this.email,
          name: this.name,
          intro: this.intro,
          github: this.github,
          instagram: this.instagram,
          facebook: this.facebook,
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token,
          }
        })
        .then((res) => {

          console.log(res);

          this.$router.push({
            name: 'Profile', params: { user_account: this.token_user_account }
          });

          ElMessage({
            message: "更新成功",
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