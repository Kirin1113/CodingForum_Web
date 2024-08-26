<template>
  <div class="page-header align-items-start border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/aicreated-images/aicreated' + randompic + '.jpg') + ')',
  }">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
          <div class="card z-index-0">
            <div class="card-body">
              <form role="form" @submit.prevent="register">
                <div class="">
                  <label>學號</label>
                  <input class="form-control" v-model="account" type="text" placeholder="sxxxxxxx" aria-label="學號" />
                </div>
                <div class="">
                  <label>密碼</label>
                  <input class="form-control" v-model="password" type="password" placeholder="請輸入密碼" aria-label="密碼" />
                </div>
                <div class="">
                  <label>請再輸入一次密碼</label>
                  <input class="form-control" v-model="repeat_password" type="password" placeholder="請再輸入一次密碼"
                    aria-label="密碼" />
                </div>
                <div class="">
                  <label>信箱</label>
                  <input class="form-control" v-model="email" type="email" placeholder="請輸入信箱" aria-label="信箱" />
                </div>
                <div class="">
                  <label>中文姓名</label>
                  <input class="form-control" v-model="name" type="text" placeholder="請輸入中文姓名" aria-label="中文姓名" />
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
      name: "",
      account: "",
      password: "",
      repeat_password: "",
      email: "",
      randompic: Math.floor(Math.random() * 5)
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
