<template>
  <navbar btn-background="bg-gradient-primary" />
  <div class="pt-5 m-3 page-header align-items-start min-vh-50 pb-11 border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/curved-images/curveda' + randompic + '.jpg') + ')',
  }">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container">
      <div class="row justify-content-center">
        <div class="mx-auto text-center col-lg-5">
          <h1 class="mt-5 mb-2 text-white">同學歡迎!</h1>
          <p class="text-white text-lead">
            同學你好，歡迎來到這個平台！為了能夠更好地使用這個平台的功能<br>請先註冊一個帳號。註冊後，你就可以享受到更多的學習資源和互動機會，讓你的學習之路更加豐富多彩。謝謝！
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
            <form role="form" @submit.prevent="register">
              <div class="">
                <label>學號</label>
                <input class="form-control" v-model="account" type="text" placeholder="學號 小寫s開頭" aria-label="學號" />
              </div>
              <div class="">
                <label>密碼</label>
                <input class="form-control" v-model="password" type="password" placeholder="密碼" aria-label="密碼" />
              </div>
              <div class="">
                <label>請再輸入一次密碼</label>
                <input class="form-control" v-model="repeat_password" type="password" placeholder="請再輸入一次密碼"
                  aria-label="密碼" />
              </div>
              <div class="">
                <label>信箱</label>
                <input class="form-control" v-model="email" type="email" placeholder="信箱" aria-label="信箱" />
              </div>
              <div class="">
                <label>中文姓名</label>
                <input class="form-control" v-model="name" type="text" placeholder="中文姓名" aria-label="中文姓名" />
              </div>

              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="my-4 mb-2">註冊</soft-button>
              </div>
              <p class="text-sm mt-3 mb-0">
                已經有帳號了嗎?
                <router-link :to="{ name: 'Sign In' }" class="text-dark font-weight-bolder">
                  登入
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import SoftButton from "@/components/SoftButton.vue";

import { mapMutations } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "SignupBasic",
  components: {
    Navbar,
    AppFooter,
    SoftButton,
  },
  data() {
    return {
      name: "",
      account: "",
      password: "",
      repeat_password: "",
      email: "",
      randompic: Math.floor(Math.random() * 9)

    };
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    register() {
      if (
        this.name === "" ||
        this.account === "" ||
        this.password === "" ||
        this.repeat_password === "" ||
        this.email === ""
      ) {
        ElMessage.error("名字、學號、密碼、信箱不能為空");
      } else if (
        this.password != this.repeat_password
      ) {
        ElMessage.error("密碼確認失敗，請檢查兩次輸入皆相同");
      }
      else {
        this.axios
          .post("/api/auth/register", {
            name: this.name,
            account: this.account,
            password: this.password,
            email: this.email,
          })

          .then((res) => {
            console.log(res);
            ElMessage({
              message: "註冊成功 請登入",
              type: "success",
              duration: 5000,
            });
            this.$router.push({ name: 'Sign In' });
          })

          .catch(function (error) {
            if (error.response) {
              console.log(error.response.status);
              if (error.response.status == 402) {
                ElMessage.error(error.response.data.error);
              }
            }
          });
      }
    },
  },
};
</script>
