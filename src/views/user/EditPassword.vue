<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <label>舊密碼</label>
                <input class="form-control" v-model="old_password" type="text" placeholder="請輸入舊密碼" required />
              </div>
              <div class="mb-3">
                <label>新密碼</label>
                <input class="form-control" v-model="password" type="text" placeholder="請輸入新密碼" aria-label="密碼" />
              </div>
              <div class="mb-3">
                <label>請再輸入一次新密碼</label>
                <input class="form-control" v-model="repeat_password" type="text" placeholder="請再輸入一次新密碼"
                  aria-label="密碼" />
              </div>
              <div class="text-center">
                <soft-button color="warning" full-width variant="gradient" class="mt-2 mb-2"
                  @click.stop.prevent="edit()">更新</soft-button>
                <soft-button color="dark" full-width variant="gradient" class="mb-5"
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
  name: "EditPassword",
  components: {
    SoftButton,
  },
  data() {
    return {
      old_password: '',
      password: '',
      repeat_password: '',
      token: this.$cookies.get("token"),
      token_user_id: this.$cookies.get("user_id"),
      token_user_account: this.$cookies.get("user_account"),
      user: [],
    };
  },
  methods: {
    edit() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      if (
        this.password != this.repeat_password
      ) {
        ElMessage.error("密碼確認失敗，請檢查兩次輸入皆相同");
      } else {
        this.axios
          .post("/api/auth/edit_password", {
            old_password: this.old_password,
            account: this.token_user_account,
            password: this.password,
          }, {
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
      }
    },
  },
}
</script>

<style>
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