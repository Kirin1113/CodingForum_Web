<template>
  <div class="page-header align-items-start min-vh-50 pb-11 border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/gradiented-images/gradiented' + randompic + '.jpg') + ')',
  }">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container">
      <div class="row justify-content-center">
        <div class="mx-auto text-center col-lg-5">
          <h1 class="mt-5 mb-2 text-white">忘記密碼</h1>
          <p class="text-white text-lead">
            填寫當初註冊的信箱，更改密碼的信將會寄給你！
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
      <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
        <el-main style="padding:0" v-loading="loading" element-loading-text="發送中"
          element-loading-background="rgb(248 248 248)">
          <div class="card z-index-0">
            <div class="card-body">
              <form role="form" @submit.prevent="register">
                <div class="mb-3">
                  <label>信箱</label>
                  <input class="form-control" v-model="email" type="email" placeholder="請輸入信箱" aria-label="信箱" />
                </div>
                <div class="text-center">
                  <soft-button color="dark" full-width variant="gradient" class="my-4 mb-2">發送</soft-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  想起原本的密碼了嗎?
                  <router-link :to="{ name: 'Sign In' }" class="text-dark font-weight-bolder">
                    登入
                  </router-link>
                </p>
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
import { mapMutations } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "SignupBasic",
  components: {
    SoftButton,
  },
  data() {
    return {
      email: "",
      randompic: Math.floor(Math.random() * 18),
      loading: false
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
      this.loading = true
      if (
        this.email === ""
      ) {
        ElMessage.error("信箱不能為空");
      } else {
        this.axios
          .post("/api/auth/reset_password/send", {
            email: this.email,
          })
          .then((res) => {
            console.log(res);
            ElMessage({
              message: "發送成功，請前往信箱，點選信中網址修改密碼",
              type: "success",
              duration: 10000,
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
        this.loading = false
      }
    },
  },
};
</script>
