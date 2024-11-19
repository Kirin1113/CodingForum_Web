<template>
  <div class="page-header align-items-start border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/aicreated-images/aicreated' + randompic + '.jpg') + ')',
  }">
    <div class="container">
      <div class="row align-items-center min-vh-100 justify-content-center">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
          <div class="card z-index-0">
            <div class="card-body">
              <form role="form" @submit.prevent="register">
                <div class="mb-3">
                  <label>密碼</label>
                  <input class="form-control" v-model="password" type="password" placeholder="請輸入密碼" aria-label="密碼" />
                </div>
                <div class="mb-3">
                  <label>請再輸入一次密碼</label>
                  <input class="form-control" v-model="password_confirmation" type="password" placeholder="請再輸入一次密碼"
                    aria-label="密碼" />
                </div>
                <div class="text-center">
                  <soft-button color="warning" full-width variant="gradient" class="my-4 mb-2">確認</soft-button>
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
      randompic: Math.floor(Math.random() * 5),
      password: "",
      password_confirmation: ""
    };
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  mounted() {
    const that = this;
    this.axios
      .post("/api/auth/reset_password/check", {
        token: this.$route.params.reset_password_token,
      })

      .then((res) => {
        console.log(res);
      })

      .catch(function (error) {
        if (error.response) {
          ElMessage.error(error.response.data.error);
          if (error.response.status == 403) {
            that.$router.push({ name: 'resend_password' });
          } else if (error.response.status == 402) {
            that.$router.push({ name: 'Dashboard' });
          }
        }
      });
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    register() {
      if (
        this.email === ""
      ) {
        ElMessage.error("信箱不能為空");
      } else {
        this.axios
          .post("/api/auth/reset_password/reset", {
            token: this.$route.params.reset_password_token,
            password: this.password,
            password_confirmation: this.password_confirmation,
          })
          .then((res) => {
            console.log(res);
            ElMessage({
              message: "重置密碼成功，請重新登入",
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
