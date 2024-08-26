<template>
  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur"
    data-scroll="true">
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :currentPage="currentRouteName" :textWhite="textWhite" />
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">
        <div class="pe-md-3 d-flex align-items-center ms-md-auto">
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center dropdown">
            <div v-if="this.$route.name == 'Dashboard' || this.$route.name == 'Profile'"
            :key="this.$route.name" style="display: flex;">
              <div class="mt-1" style="cursor: pointer;" @click="resetpost"  data-bs-toggle="tooltip" title="所有影片">
                <i class="fa-solid fa-video"></i>
              </div>
              <div class="me-3 selectuva">
                <SelectUva :key="resetpostvalue" />
              </div>
              <div style="cursor: pointer;" class="me-3 mt-1"  data-bs-toggle="tooltip" title="篩選器" >
                <i class="fas fa-filter" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop'"></i>
              </div>
            </div>
            <div v-if="this.$route.name == 'MyFavorite' || this.$route.name == 'MyLike' 
            || this.$route.name == 'MyWatch'"
            :key="this.$route.name" style="display: flex;">
              <div class="mt-1" style="cursor: pointer;" @click="resetpost"  data-bs-toggle="tooltip" title="全部">
                <i class="fa-solid fa-video"></i>
              </div>
              <div class="me-3 selectuva">
                <SelectAuthor :key="resetpostvalue"/>
              </div>
            </div>
            <div v-if="user_account" @click="upload" class="me-3" style="cursor: pointer"  data-bs-toggle="tooltip" title="上傳影片">
              <i class="fas fa-upload"></i>
            </div>
            <TagedCard :key="TagedCardkey" @TagedCardkeyadd="TagedCardkeyadd" v-if="user_account" data-bs-toggle="tooltip" title="通知" />
            <a v-if="user_account" class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <img class="userimg comment__avatar" :src="now_user_pic_url" alt="" />
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'Profile', params: { user_account: user_account } }">
                  個人檔案
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'EditUser' }">
                  編輯個資
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'EditPic' }">
                  編輯頭貼
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'EditCover' }">
                  編輯封面
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'EditPassword' }">
                  修改密碼
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <span class="dropdown-item" style="font-weight: 700;" @click="logout">登出</span>
              </li>
            </ul>
          </li>
          <div v-if="!user_account" @click="login" class="px-0 nav-link font-weight-bold text-body me-3"
            style="cursor:pointer">
             <i class="fas fa-user" data-bs-toggle="tooltip" title="登入"></i>
          </div>
          <li class="nav-item d-xl-none d-flex align-items-center">
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
  <div class="modal fade" :id="'staticBackdrop'" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">影片篩選</h5>
                  <i class="fa fa-times" data-bs-dismiss="modal" style="cursor: pointer; font-size: 24px;"></i>
              </div>
              <div class="modal-body">
                  <div class="row">
                      <!-- 影片排序方式 -->
                      <div class="col-md-4 col-12">
                          <h6>影片排序方式</h6>
                          <div class="d-flex flex-column gap-2">
                              <CodeCard type=0 sort='"最新發布" ' />
                              <CodeCard type=1 sort='"最早發布" ' />
                              <CodeCard type=2 sort='"按讚最多" ' />
                              <CodeCard type=3 sort='"按讚最少" ' />
                              <CodeCard type=4 sort='"最多留言" ' />
                              <CodeCard type=5 sort='"最少留言" ' />
                              <CodeCard type=6 sort='"點擊最多" ' />
                              <CodeCard type=7 sort='"點擊最少" ' />
                          </div>
                      </div>
                      <!-- 影片CPE星數 -->
                      <div class="col-md-4 col-12">
                          <h6>影片CPE星數</h6>
                          <div class="d-flex flex-column gap-2">
                              <CodeCard type=8 sort='"全部" ' />
                              <CodeCard type=9 sort='"0星" ' />
                              <CodeCard type=10 sort='"1星" ' />
                              <CodeCard type=11 sort='"2星" ' />
                              <CodeCard type=12 sort='"3星" ' />
                              <CodeCard type=13 sort='"4星" ' />
                              <CodeCard type=14 sort='"5星" ' />
                          </div>
                      </div>
                      <!-- 影片程式語言 -->
                      <div class="col-md-4 col-12">
                          <h6>影片程式語言</h6>
                          <div class="d-flex flex-column gap-2">
                              <CodeCard type=15 sort='"全部" ' />
                              <CodeCard type=16 sort='"C"' />
                              <CodeCard type=17 sort='"C++" ' />
                              <CodeCard type=18 sort='"Java" ' />
                              <CodeCard type=19 sort='"Python" ' />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import { mapMutations, mapActions } from "vuex";
import { ElMessage } from "element-plus";
import SelectUva from "@/components/SelectUva.vue";
import TagedCard from "../../views/components/TagedCard.vue";
import CodeCard from "../Sidenav/CodeCard.vue";
import SelectAuthor from "@/components/SelectAuthor.vue";

export default {
  name: "navbar",
  components: {
    Breadcrumbs,
    SelectUva,
    CodeCard,
    TagedCard,
    SelectAuthor,
  },
  data() {
    return {
      showMenu: false,
      token: this.$cookies.get("token"),
      user_account: this.$cookies.get("user_account"),
      now_user_pic_url: this.$cookies.get("now_user_pic_url"),
      resetpostvalue: 0,
      TagedCardkey: 0
    };
  },
  props: ["minNav", "textWhite"],
  emits: ['changepost', 'resetpost'],
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
    TagedCardkeyadd() {
      this.TagedCardkey++;
    },
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
    },
    resetpost() {
      this.$nextTick(() => {
        this.$emit('resetpost')
        this.resetpostvalue++
      });
    },
    logout() {
      this.axios
        .post("/api/auth/logout", {
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token
          }
        }).then((res) => {
          this.$router.go()
          this.$cookies.remove("token")
          this.$cookies.remove("user_account")
          this.$cookies.remove("user_id")
          this.$cookies.remove("now_user_pic_url")
          this.$cookies.remove("isadmin")
          ElMessage({
            message: "登出成功",
            type: "success",
            duration: 3000,
          });
        })
    },
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

<style scoped>
.dropdown-menu {
  min-width: 6rem;
}
.userimg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.comment__avatar {
  object-fit: cover;
}

.selectuva {
  width: 200px;
}

@media (max-width: 1200px) {
  .selectuva {
    width: 160px;
  }
}
</style>
