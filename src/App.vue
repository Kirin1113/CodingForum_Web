<template>
  <sidenav :custom_class="this.$store.state.mcolor" :class="[
    this.$store.state.isTransparent,
    'fixed-start',
  ]" v-if="this.$store.state.showSidenav" />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
    <navbar :class="[navClasses]" :textWhite="this.$store.state.isAbsolute ? 'text-white opacity-8' : ''" @toggle-notes-sidebar="toggleSidebar"
      :minNav="navbarMinimize" v-if="this.$store.state.showNavbar" :key="$route.fullPath" @changepost="ref_changepost" @resetpost="ref_resetpost" />
    <NotesSidebar :isSidebarOpen="isSidebarOpen" @close-sidebar="toggleSidebar" />
    <router-view v-slot="{ Component }">
      <component ref="view" :is="Component" :key="$route.fullPath" />
    </router-view>
  </main>
</template>

<script>
import Sidenav from "./examples/Sidenav";
import Navbar from "@/examples/Navbars/Navbar.vue";
import NotesSidebar from './components/NotesSidebar.vue';
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    Sidenav,
    Navbar,
    NotesSidebar,
  },
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  methods: {
    ...mapMutations(["navbarMinimize"]),
    ref_changepost(sort) {
      this.$refs.view.changepost(sort);
    },
    ref_resetpost() {
      this.$refs.view.resetpost();
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
  computed: {
    navClasses() {
      return {
        "position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky": this
          .$store.state.isNavFixed,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
          .isAbsolute,
        "px-0 mx-4 mt-4": !this.$store.state.isAbsolute,
      };
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
  },

};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap");

#app,
.el-button,
p,
.card .card-body,
a,
input,
textarea,
button {
  font-family: "Noto Sans TC", sans-serif !important;
  font-weight: bold !important;
}

.youtube_img_fix {
  width: 104% !important;
  margin-left: -2%;
}

.container_video {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.youtub {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.downborder {
  border-left: 2px solid;
  border-right: 2px solid;
  border-bottom: 2px solid;
  border-bottom-left-radius: 15px 15px;
  border-bottom-right-radius: 15px 15px;
}

.el-main {
  overflow: inherit !important;
}

.placeholder {
  cursor: alias !important;
}

.logoicon {
  width: 38%;
}

.line {
  width: 100%;
  height: 3px;
  background-color: #000000;
}

.userimg {
  background-color: antiquewhite;
  width: 100%;
}

.ql-mention-list-container {
  max-height: 20vh;
}

.pdf-viewer {
  min-width: 0 !important;
}

.navbar .sidenav-toggler-inner {
  width: 25px !important;
}

.navbar .sidenav-toggler-inner .sidenav-toggler-line {
  height: 4px !important;
}

@media (min-width: 1200px) {
  .mobileshow {
    display: none !important;
  }

  .pc {
    display: block !important;
  }

  .breakline {
    display: contents !important;
  }
}

@media (max-width: 1200px) {
  .sidenav {
    z-index: 9999;
  }

  .breakline {
    width: 100%;
  }

  .mobileshow {
    display: block !important;
  }

  .pc {
    display: none !important;
  }

  .header__preview .start {
    display: none !important;
  }

  .el-popper {
    z-index: 9999 !important;
  }

  .el-table-column.mobiletime {
    min-width: 180% !important;
  }
}

.el-table .cell {
  text-align: center;
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
input[type="datetime"]:focus,
input[type="datetime-local"]:focus,
input[type="date"]:focus,
input[type="month"]:focus,
input[type="time"]:focus,
input[type="week"]:focus,
input[type="number"]:focus,
input[type="email"]:focus,
input[type="url"]:focus,
input[type="search"]:focus,
input[type="tel"]:focus,
input[type="color"]:focus,
.uneditable-input:focus {
  border-color: rgba(126, 239, 104, 0.8);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  background: rgb(219, 219, 219);
}

.spinner::before {
  background: rgba(255, 255, 255, 0) !important;
}
</style>