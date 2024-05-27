<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <el-main style="padding:0" v-loading="post_check" element-loading-text="上傳中"
          element-loading-background="rgb(248 248 248)">
          <div class="card z-index-0">
            <div class="card-body">
              <form role="form" @submit.prevent="post" class="mx-auto col-xl-9">
                <p>圖片將自動套用你在YT上傳影片時所設之封面</p>
                <div class="mb-3">
                  <label>影片網址(只限Youtube)</label>
                  <input class="form-control" v-model="video_url" id="video_url" type="text" placeholder="請貼入網址"
                    name="video_url" required />
                </div>
                <div class="mb-3">
                  <label>內容</label>
                  <textarea class="form-control" id="content" v-model="content" rows="5" placeholder="請輸入貼文內容"
                    required></textarea>
                </div>
                <div class="mb-3">
                  <label>請選擇題目</label>
                  <SelectUva ref="SelectUva" />
                </div>
                <div class="mb-3">
                  <label>請選擇程式語言</label>
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
                  <soft-button color="warning" full-width variant="gradient" class="my-4 mb-2"
                    :disabled="post_check">上傳</soft-button>
                  <soft-button color="dark" full-width variant="gradient" class="mb-5 mt-5"
                    @click.stop.prevent="$router.go(-1)">取消</soft-button>
                </div>
              </form>
            </div>
          </div>
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
import SelectUva from "../components/SelectUva.vue";
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
  name: "Upload",
  components: {
    SoftButton,
    Codemirror,
    SelectUva
  },
  data() {
    return {
      temp: '',
      video_url: '',
      content: '',
      select_uva: null,
      token: this.$cookies.get("token"),
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
      code: '',
      post_check: false
    };
  },
  created() {
    this.$watch(
      () => ({
        code_select: this.code_select,
      }),
      () => {
        if (this.$route.name != 'Upload') {
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
  },
  methods: {
    post() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      if (!this.$refs.SelectUva.return_select_uva()) {
        ElMessage.error("請選擇題目");
      } else {
        const that = this
        this.post_check = true
        this.axios
          .post("/api/forum/post", {
            serial: this.$refs.SelectUva.return_select_uva().serial,
            video_url: this.video_url,
            content: this.content,
            code: this.code,
            code_type: this.code_select.label,
            code_editor_type: this.code_select.value,
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
              message: "上傳成功",
              type: "success",
              duration: 3000,
            });
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response);
              that.post_check = false
              ElMessage.error(error.response.data.error);
            }
          });
      }
    },
  },
}
</script>

<style >
.codemirror-container {
  display: block;
}
</style>