<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <label>*學年度</label>
                <input class="form-control" v-model="school_year" type="text" placeholder="範例 112-1" required />
              </div>
              <div class="mb-3">
                <label>*課程名稱</label>
                <input class="form-control" v-model="name" type="text" placeholder="請輸入課程名稱" required />
              </div>
              <div class="mb-3">
                <label>課程TA</label>
                <SelectUser ref="selectuser" :TA_user_ids="TA_user_ids" :key="TA_user_ids" />
              </div>
              <div class="mb-3">
                <label>*開放選課</label>
                <el-select v-model="enable" class="m-2" placeholder="請選擇開放or關閉選課">
                  <el-option label="開放" :value=1 />
                  <el-option label="關閉" :value=0 />
                </el-select>
              </div>
              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                  @click.stop.prevent="teacher_class()">{{ showtext }}</soft-button>
                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                  @click.stop.prevent="$router.go(-1)">取消</soft-button>
                <soft-button color="danger" full-width variant="gradient" class="mt-5" data-bs-toggle="modal"
                  :data-bs-target="'#class_staticBackdrop'" @click.stop.prevent="" v-if="coding_class_id">刪除課程</soft-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" :id="'class_staticBackdrop'" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">是否確認要刪除這堂課程</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>請注意 此操作將會刪除學生繳交之檔案</h6>
          <!-- <h6>請複製下方這段文字並貼上 以確認刪除</h6>
          <h6>確認刪除{{ school_year }}_{{ name }}</h6>
          <input class="form-control" v-model="check" type="text" :placeholder="'確認刪除' + school_year + '_' + name"
            required /> -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
            @click.stop.prevent="del_teacher_class">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
import SelectUser from '@/components/SelectUser.vue';

export default {
  name: "OperateTeacherClass",
  components: {
    SoftButton,
    SelectUser
  },
  data() {
    return {
      users: [],
      school_year: '',
      name: '',
      token: this.$cookies.get("token"),
      coding_class_id: this.$route.params.coding_class_id,
      TA_user_ids: [],
      showtext: '開課',
      enable: '',
      // check: ''
    };
  },
  created() {
    this.$watch(
      () => ({
        coding_class_id: this.coding_class_id,
      }),
      () => {
        if (this.$route.name != 'OperateTeacherClass') {
          return;
        }
        if (this.coding_class_id) {
          this.showtext = '更新課程'
          const that = this;
          this.axios
            .post("/api/class/admin/get_teacher_class", {
              coding_class_id: this.coding_class_id
            }, {
              headers: {
                'Authorization': `Bearer ` + this.token
              }
            })
            .then((res) => {
              console.log(res)
              this.school_year = res.data.success.school_year
              this.name = res.data.success.name
              this.enable = res.data.success.enable
              this.TA_user_ids = res.data.success.TA_user_ids
            }).catch(function (error) {
              ElMessage.error(error.response.data.error);
              that.$router.push({ name: 'TeacherClass' });
            });
        }
      },
      { deep: true, immediate: true }
    );
    this.axios
      .get("/api/auth/get_all_user", {
      }, {
      })
      .then((res) => {
        this.users = res.data.success
        console.log(res.data.success);
      })
  },
  methods: {
    teacher_class() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      this.axios
        .post("/api/class/admin/teacher_class", {
          coding_class_id: this.coding_class_id,
          school_year: this.school_year,
          name: this.name,
          TA_user_ids: this.$refs.selectuser.return_TA_user_ids(),
          enable: this.enable
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          this.$router.push({
            name: 'TeacherClass',
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
            ElMessage.error(error.response.data.error);
          }
        });

    },
    del_teacher_class() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      // const that = this
      this.axios
        .post("/api/class/admin/del_teacher_class", {
          coding_class_id: this.coding_class_id,
          // check: this.check
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          console.log(res);
          this.$router.replace({
            name: 'TeacherClass'
          });
          ElMessage({
            message: "刪除成功",
            type: "success",
            duration: 3000,
          });
        })
        .catch(function (error) {
          if (error.response) {
            // that.check = '';
            ElMessage.error(error.response.data.error);
          }
        });
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