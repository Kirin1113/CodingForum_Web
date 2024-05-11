<template>
  <aside class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl ms-3"
    id="sidenav-main">

    <div class="sidenav-header" style="    text-align: center;">
      <i class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true" id="iconSidenav"></i>
      <router-link class="" :to="{ name: 'Dashboard' }">
        <img src="@/assets/img/logo3.png" class="logoicon" alt="main_logo" />
      </router-link>
    </div>
    <hr class="mt-4 horizontal dark" />
    <sidenav-list :cardBg="customClass" />
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import { mapState } from "vuex";

export default {
  name: "index",
  components: {
    SidenavList,
  },
  data() {
    return {
    };
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
  },
  emits: ['changepost', 'resetpost'],
  computed: {
    ...mapState(["isRTL"]),
  },

};
</script>
