<template>
  <div class="page-header align-items-start min-vh-50 pb-11 border-radius-lg" :style="{
    backgroundImage:
      'url(' + require('@/assets/img/gradiented-images/gradiented' + randompic + '.jpg') + ')',
  }">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container">
      <div class="row justify-content-center">
        <div class="mx-auto text-center col-lg-5">
          <h1 class="mt-5 mb-2 text-white">更改密碼連結已過期或不存在</h1>
          <p class="text-white text-lead">
            點選下方按鈕，重新填寫信箱!
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
            <div class="text-center">
              <soft-button color="info" full-width variant="gradient" class="my-4 mb-2"
                @click="this.$router.push({ name: 'forget_password' });">前往</soft-button>
            </div>
            <p class="text-sm mt-3 mb-0">
              想起原本的密碼了嗎?
              <router-link :to="{ name: 'Sign In' }" class="text-dark font-weight-bolder">
                登入
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftButton from "@/components/SoftButton.vue";
import { mapMutations } from "vuex";

export default {
  name: "SignupBasic",
  components: {
    SoftButton,
  },
  data() {
    return {
      email: "",
      randompic: Math.floor(Math.random() * 18)
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
  },
};
</script>
