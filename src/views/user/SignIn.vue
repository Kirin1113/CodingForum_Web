<template>
  <div class="page-header align-items-start min-vh-50 pb-11 border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/gradiented-images/gradiented' + randompic + '.jpg') + ')',
  }">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container">
      <div class="row justify-content-center">
        <div class="mx-auto text-center col-lg-5">
          <h1 class="mt-5 mb-2 text-white">歡迎回來!</h1>
          <p class="text-white text-lead">
            登入後繼續你的學習旅程吧!
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
      <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" @submit.prevent="login">
              <div class="mb-3">
                <label>學號</label>
                <input class="form-control" v-model="account" id="account" type="text" placeholder="請輸入學號 小寫s開頭"
                  name="account" />
              </div>
              <div class="mb-3">
                <label>密碼</label>
                <input class="form-control" v-model="password" id="password" type="password" placeholder="請輸入密碼"
                  name="password" />
              </div>
              <el-switch v-model="remember_me" active-text="記住我" />
              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="my-4 mb-2">登入</soft-button>
              </div>
              <p class="text-sm mt-3 mb-0">
                忘記密碼了嗎?
                <router-link :to="{ name: 'forget_password' }" class="text-dark font-weight-bolder">
                  修改密碼
                </router-link>
              </p>
              <p class="text-sm mt-3 mb-0">
                還沒有帳號嗎?
                <router-link :to="{ name: 'Sign Up' }" class="text-dark font-weight-bolder">
                  註冊
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftButton from "@/components/SoftButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "SignIn",
  components: {
    SoftButton,
  },
  data() {
    return {
      account: this.$cookies.get("account"),
      password: this.$cookies.get("password"),
      remember_me: true,
      randompic: Math.floor(Math.random() * 18)

    };
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    login() {
      this.axios
        .post("/api/auth/login", {
          account: this.account,
          password: this.password,
        })
        .then((res) => {
          if (this.remember_me == true) {
            this.$cookies.set("account", this.account, "2d");
            this.$cookies.set("password", this.password, "2d");
          } else {
            this.$cookies.remove("account");
            this.$cookies.remove("password");
          }
          console.log(res);
          const user_account = res.data.user.account;
          this.$cookies.set("token", res.data.success, "1d");
          this.$cookies.set("user_account", user_account, "1d");
          this.$cookies.set("user_id", res.data.user.id, "1d");
          this.$cookies.set("isadmin", res.data.user.isadmin, "1d");
          this.$cookies.set("now_user_pic_url", this.$global_url + res.data.user.picture, "1d");
          if (this.$cookies.isKey("go_login_then_backpost")) {
            this.$router.push({
              name: 'Video',
              params: {
                post_id: this.$cookies.get("go_login_then_backpost"),
              }
            });
            this.$cookies.remove("go_login_then_backpost")
          } else {
            this.$router.replace({ name: 'Profile', params: { user_account: user_account } });
          }
          ElMessage({
            message: "登入成功",
            type: "success",
            duration: 3000,
          });
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.status);
            if (error.response.status == 401) {
              ElMessage.error("帳密錯誤");
            }
          }
        });
    },
  },
};
</script>
