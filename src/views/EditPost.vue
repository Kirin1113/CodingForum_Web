<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <p>圖片是套用你在YT上傳影片時所設之封面</p>
                <img :src="video_pic_url" alt="" class="video_pic">
              </div>
              <div class="mb-3">
                <label>*影片網址(只限Youtube)</label>
                <input class="form-control" v-model="video_url" id="video_url" type="text" placeholder="請貼入網址"
                  name="video_url" required />
              </div>
              <div class="mb-3">
                <label>*內容</label>
                <textarea class="form-control" id="content" v-model="content" rows="5" placeholder="請輸入影片內容"
                  required></textarea>
              </div>
              <div class="mb-3">
                <label>*請選擇題目</label>
                <el-select ref="elselect" :key="selreload" v-model="select_uva" popper-class="virtualSelect"
                  @visible-change="visibleVirtualoptions" filterable remote :remote-method="remoteMethod"
                  placeholder="請選擇題目" no-data-text="找不到題目" loading-text="題目加載中...">
                  <el-option v-if="select_uva.length != 0" :label=select_uva.label :value=select_uva />
                  <virtual-list ref="VirtualList" :key="reload" style="max-height: 245px; overflow-y: auto;"
                    :data-key="'id'" :data-sources="uvas" :data-component="itemComponent" :keeps="20" />
                </el-select>
              </div>
              <div class="mb-3">
                <label>*請選擇程式語言</label>
                <el-select v-model="code_select" class="" placeholder="請選擇程式語言">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item" />
                </el-select>
              </div>
              <div class="mb-3">
                <label>請輸入程式碼</label>
                <Codemirror v-model:value="code" :options="cmOptions" border ref="cmRef" height="400" width="100%"
                  @change="onChange" @input="onInput" @ready="onReady" :key="selete_loading">
                </Codemirror>
              </div>
              <div class="text-center">
                <soft-button color="warning" full-width variant="gradient" class="mt-2 mb-2" @click.stop.prevent="post()">更新
                  (若期限內之作業有綁定此影片將同時更新)</soft-button>
                <soft-button color="dark" full-width variant="gradient" class="mb-5"
                  @click.stop.prevent="$router.go(-1)">取消</soft-button>
                <soft-button color="danger" full-width variant="gradient" class="mt-5" data-bs-toggle="modal"
                  :data-bs-target="'#staticBackdrop' + post_id" @click.stop.prevent="">刪除影片</soft-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" :id="'staticBackdrop' + post_id" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">是否確認要刪除這部影片</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6> 請注意 若此影片有當作業繳交 將會取消繳交作業</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
            @click.stop.prevent="delpost()">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import virtualList from 'vue3-virtual-scroll-list'
import ElOptionNode from '@/components/el-option-node';
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
import Codemirror from "codemirror-editor-vue3"
// language
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/python/python.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/lucario.css";

export default {
  name: "EditPost",
  components: {
    'virtual-list': virtualList,
    SoftButton,
    Codemirror,
  },
  data() {
    return {
      post_id: this.$route.params.post_id,
      uvas: [],
      itemComponent: ElOptionNode,
      virtualoptions: [],
      reload: 0,
      selreload: 0,
      temp: '',
      video_url: '',
      video_pic_url: '',
      content: '',
      select_uva: [],
      token: this.$cookies.get("token"),
      token_user_account: this.$cookies.get("account"),
      options: [{ value: 'text/x-csrc', label: 'C' }, { value: 'text/x-c++src', label: 'C++' }, { value: 'text/x-java', label: 'Java' }, { value: 'python', label: 'Python' }],
      code_select: { value: 'text/x-csrc', label: 'C' },
      selete_loading: 0,
      cmOptions: {
        mode: 'text/x-csrc', // Language mode
        theme: 'lucario', // Theme
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autofocus: true,
      },
      code: ''
    };
  },
  created() {
    this.$watch(
      () => ({
        post_id: this.post_id,
      }),
      () => {
        if (this.$route.name != 'EditPost') {
          return;
        }
        if (!this.post_id) {
          this.$router.push({ name: 'Dashboard' });
        }
        this.axios
          .post("/api/forum/get_post", {
            post_id: this.post_id
          })
          .then((res) => {
            console.log(res)
            this.video_url = res.data.success.video_url
            this.video_pic_url = res.data.success.video_pic_url
            this.content = res.data.success.content
            this.select_uva = { value: res.data.success.uva_topic.id, serial: res.data.success.uva_topic.serial, label: res.data.success.uva_topic.show }
            this.code_select = { value: res.data.success.code_editor_type, label: res.data.success.code_type }
            this.code = res.data.success.code
          })
      },
      { deep: true, immediate: true }
    );
    this.$watch(
      () => ({
        code_select: this.code_select,
      }),
      () => {
        if (this.$route.name != 'EditPost') {
          return;
        }
        this.cmOptions = {
          mode: this.code_select.value,
          theme: "lucario",
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          lineWrapping: true,
          matchBrackets: true,
          autofocus: true,
        },
          this.selete_loading++
      },
      { deep: true, immediate: true }
    );
    this.axios
      .get("/api/forum/get_uva", {
      })
      .then((res) => {
        this.virtualoptions = res.data.success
        this.uvas = this.virtualoptions;
        this.reload++;
      })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.reload++
        this.uvas = this.virtualoptions.filter(item => {
          return item.show.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.uvas = this.virtualoptions;
      }
    },
    visibleVirtualoptions(bool) {
      if (!bool) {
      }
      if (this.select_uva) {
        this.$refs.VirtualList.scrollToIndex(this.select_uva.value - 3)
      }
    },
    post() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      if (!this.select_uva) {
        ElMessage.error("請選擇題目");
      } else {
        this.axios
          .post("/api/forum/post", {
            serial: this.select_uva.serial,
            video_url: this.video_url,
            content: this.content,
            code: this.code,
            code_type: this.code_select.label,
            code_editor_type: this.code_select.value,
            post_id: this.post_id
          }, {
            headers: {
              'Authorization': `Bearer ` + this.token
            }
          })
          .then((res) => {
            console.log(res);
            this.$router.push({
              name: 'Video', params: { post_id: res.data.post_id }
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
              if (error.response.status == 402) {
                ElMessage.error(error.response.data.error);
              }
            }
          });
      }
    },
    delpost() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      this.axios
        .post("/api/forum/del_post", {
          post_id: this.post_id
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        })
        .then((res) => {
          console.log(res);
          this.$router.push({
            name: 'Profile', params: { user_account: this.token_user_account }
          });
          ElMessage({
            message: "刪除成功",
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