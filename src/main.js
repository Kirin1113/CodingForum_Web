import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import SoftUIDashboard from "./soft-ui-dashboard";
import ElementPlus from "element-plus";
import locale from "element-plus/es/locale/lang/zh-tw";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import axios from "axios";
import VueAxios from "vue-axios";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import timeago from "vue-timeago3";
import { zhTW } from "date-fns/locale";
import { InstallCodemirro } from "codemirror-editor-vue3";
import "@/assets/css/test2.css";

const timeagoOptions = {
  locale: zhTW,
};

const app = createApp(App);
app.component("QuillEditor", QuillEditor);
app.use(ElementPlus, {
  locale: { locale },
});
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$app_name = "程式設計交流平台";
app.config.globalProperties.$global_url = "http://localhost/Coding-platform/CodingPlatform_api/public/";
app.config.globalProperties.$global_default_pic_url =
  "http://localhost/Coding-platform/CodingPlatform_api/public/uploads/userpic/default_user.png";
app.config.globalProperties.$global_assignment_url =
  "http://localhost/Coding-platform/CodingPlatform_api/public/uploads/assignment/";
app.config.globalProperties.$child_comment_onceshow = 3;
app.config.globalProperties.window = window;
app
  .use(store)
  .use(VueAxios, axios)
  .use(router)
  .use(timeago, timeagoOptions)
  .use(require("vue-cookies"))
  .use(SoftUIDashboard)
  .use(InstallCodemirro)
  .mount("#app");
