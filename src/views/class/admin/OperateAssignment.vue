<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <label>*作業名稱</label>
                <input class="form-control" v-model="name" type="text" placeholder="請輸入作業名稱" required />
              </div>
              <div class="mb-3">
                <label>作業內容</label>
                <textarea class="form-control" id="content" v-model="content" rows="5" placeholder="請輸入作業內容"></textarea>
              </div>
              <div class="mb-3">
                <label>*作業型式 (建立作業後不可調整)</label>
                <el-select v-model="type" class="m-2" placeholder="選擇作業型式" :disabled="disabled">
                  <el-option label="只交影片" :value=1 />
                  <el-option label="只交檔案" :value=2 />
                  <el-option label="檔案+影片" :value=3 />
                </el-select>
              </div>
              <div class="mb-3">
                <label>*作業開始時間</label>
                <el-config-provider :locale="locale">
                  <div class="block">
                    <el-date-picker v-model="start_at" type="datetime" placeholder="開始日期時間" />
                  </div>
                </el-config-provider>
              </div>
              <div class="mb-3">
                <label>*作業結束時間</label>
                <el-config-provider :locale="locale">
                  <div class="block">
                    <el-date-picker v-model="end_at" type="datetime" placeholder="結束日期時間" />
                  </div>
                </el-config-provider>
              </div>
              <div class="mb-3" v-if="assignment_id">
                <label>作業檔案(檔名勿重複)</label>
                <admin-file-upload ref="FileUpload" />
              </div>

              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                  @click.stop.prevent="assignment()">{{ showtext }}</soft-button>
                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                  @click.stop.prevent="$router.go(-1)">取消</soft-button>
                <soft-button color="danger" full-width variant="gradient" class="mt-5" data-bs-toggle="modal"
                  :data-bs-target="'#class_staticBackdrop'" @click.stop.prevent="" v-if="assignment_id">刪除作業</soft-button>
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
          <h5 class="modal-title">是否確認要刪除此作業</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>請注意 此操作將會刪除學生繳交之檔案</h6>
          <h6>請在下方輸入這段文字 以確認刪除</h6>
          <h6>確認刪除{{ name }}</h6>
          <input class="form-control" v-model="check" type="text" :placeholder="'確認刪除' + name" required />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
            @click.stop.prevent="del_assignment">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/dist/locale/en'
import dayjs from 'dayjs'
import AdminFileUpload from "@/components/AdminFileUpload.vue";

export default {
  name: "OperateAssignment",
  components: {
    SoftButton,
    AdminFileUpload
  },
  data() {
    return {
      locale: en,
      users: [],
      name: '',
      content: '',
      start_at: '',
      end_at: '',
      token: this.$cookies.get("token"),
      coding_class_id: this.$route.params.coding_class_id,
      assignment_id: this.$route.params.assignment_id,
      showtext: '下一步',
      type: '',
      disabled: false
    };
  },
  created() {
    this.$watch(
      () => ({
        coding_class_id: this.coding_class_id,
        assignment_id: this.assignment_id,
      }),
      () => {
        if (this.$route.name != 'OperateAssignment') {
          return;
        }
        console.log(this.assignment_id)
        if (this.assignment_id) {
          this.showtext = '更新作業'
          const that = this;
          this.axios
            .post("/api/class/get_assignment", {
              coding_class_id: this.coding_class_id,
              assignment_id: this.assignment_id
            }, {
              headers: {
                'Authorization': `Bearer ` + this.token
              }
            })
            .then((res) => {
              console.log(res.data.success)
              this.name = res.data.success.name
              this.content = res.data.success.content
              this.type = res.data.success.type
              this.disabled = true
              this.start_at = res.data.success.start_at
              this.end_at = res.data.success.end_at
              this.$refs.FileUpload.files = res.data.success.file ? res.data.success.file : []
            }).catch(function (error) {
              ElMessage.error(error.response.data.error);
              that.$router.push({ name: 'Assignment', params: { coding_class_id: this.coding_class_id } });
            });
        }
      },
      { deep: true, immediate: true }
    );
  },
  methods: {
    assignment(updatefile) {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      var file_ = []
      if (this.assignment_id) {
        var FileUpload = this.$refs.FileUpload.returnFiles();
        FileUpload.map(function (value, key) {
          if (value.success)
            file_.push({ 'name': value.name, 'size': value.size, "success": true, "progress": "100.00", "id": value.id })
        });
      }
      this.axios
        .post("/api/class/admin/assignment", {
          coding_class_id: this.coding_class_id,
          name: this.name,
          content: this.content,
          type: this.type,
          start_at: dayjs(this.start_at).format("YYYY-MM-DD HH:mm:ss"),
          end_at: dayjs(this.end_at).format("YYYY-MM-DD HH:mm:ss"),
          assignment_id: this.assignment_id,
          file: file_,
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          console.log(res);
          if (!this.assignment_id) {
            this.$router.replace({
              name: 'OperateAssignment', params: { coding_class_id: this.coding_class_id, assignment_id: res.data.assignment_id }
            });
          } else {
            if (updatefile != 1) {
              this.$router.push({
                name: 'Assignment', params: { coding_class_id: this.coding_class_id }
              });
              ElMessage({
                message: res.data.success,
                type: "success",
                duration: 3000,
              });
            }
          }
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
            ElMessage.error(error.response.data.error);
          }
        });
    },
    del_assignment() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      const that = this
      this.axios
        .post("/api/class/admin/del_assignment", {
          assignment_id: this.assignment_id,
          check: this.check
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          console.log(res);
          this.$router.replace({
            name: 'Assignment', params: { coding_class_id: this.coding_class_id }
          });
          ElMessage({
            message: "刪除成功",
            type: "success",
            duration: 3000,
          });
        })
        .catch(function (error) {
          if (error.response) {
            that.check = '';
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