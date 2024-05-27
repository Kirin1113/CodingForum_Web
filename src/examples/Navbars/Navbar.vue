<template>
  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur"
    data-scroll="true">
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :currentPage="currentRouteName" :textWhite="textWhite" />
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">
        <div class="pe-md-3 d-flex align-items-center ms-md-auto">
        </div>
        <ul class="navbar-nav justify-content-end">
          <div v-if="user_account" @click="upload" class="me-3 mt-3" style="cursor:pointer">
            <i class="fas fa-upload"></i>
          </div>
          <!-- <TagedCard class="me-2" :key="TagedCardkey" @TagedCardkeyadd="TagedCardkeyadd" v-if="user_account" /> -->
          <li class="nav-item d-flex align-items-center">
            <router-link v-if="user_account" :to="{ name: 'Profile', params: { user_account: user_account } }"
              class="px-0 nav-link font-weight-bold text-body">
              <img class="userimg comment__avatar " :src="now_user_pic_url" alt="" />
            </router-link>
            <div v-if="!user_account" @click="login" class="px-0 nav-link font-weight-bold text-body"
              style="cursor:pointer">
              <span class="d-sm-inline d-none">登入</span>
            </div>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a @click="toggleSidebar" class="p-0 nav-link text-body" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import { mapMutations, mapActions } from "vuex";
// import TagedCard from "../../views/components/TagedCard.vue";

export default {
  name: "navbar",
  components: {
    Breadcrumbs,
    // TagedCard
  },
  data() {
    return {
      showMenu: false,
      token: this.$cookies.get("token"),
      user_account: this.$cookies.get("user_account"),
      now_user_pic_url: this.$cookies.get("now_user_pic_url"),
      // TagedCardkey: 0
    };
  },
  props: ["minNav", "textWhite"],
  created() {
    this.minNav;
    this.$watch(
      () => ({
        post_id: this.$route.params.post_id,
      }),
      () => {
        if (this.$route.name != 'Video') {
          this.post_id = ''
          return;
        }
        this.post_id = this.$route.params.post_id
      },
      { deep: true, immediate: true }
    );
    this.$watch(
      () => ({
        fullPath: this.$route.fullPath
      }),
      () => {
        if (window.innerWidth < 1200) {
          const sidenav_show = document.querySelector(".g-sidenav-show");
          sidenav_show.classList.add("g-sidenav-hidden");
          sidenav_show.classList.remove("g-sidenav-pinned");
        }
      },
      { deep: true, immediate: true }
    );
  },
  methods: {
    ...mapMutations(["navbarMinimize"]),
    ...mapActions(["toggleSidebarColor"]),
    // TagedCardkeyadd() {
    //   this.TagedCardkey++;
    // },
    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
    login() {
      if (this.post_id) {
        this.$cookies.set("go_login_then_backpost", this.post_id, "3min");
      }
      this.$router.push({ name: 'Sign In' });
    },
    upload() {
      this.$router.push({ name: 'Upload' });
    },
    test() {
      console.log(this.$refs.SelectUva.return_select_uva())
    }
  },
  computed: {
    currentRouteName() {
    },
  },
  updated() {
    const navbar = document.getElementById("navbarBlur");
    if (navbar) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 10 && this.$store.state.isNavFixed) {
          navbar.classList.add("blur");
          navbar.classList.add("position-sticky");
          navbar.classList.add("shadow-blur");
        } else {
          navbar.classList.remove("blur");
          navbar.classList.remove("position-sticky");
          navbar.classList.remove("shadow-blur");
        }
      });
    }
  },
};
</script>
