<template>
  <!-- max-height-vh-100 h-100 -->
  <div class="w-auto h-auto collapse navbar-collapse " id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse navText="首頁" :to="{ name: 'Dashboard' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="所有使用者" :to="{ name: 'AllUser' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="線上編譯器" :to="{ name: 'OnlineComplier' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <ul class="navbar-nav">
      <li class="nav-item" v-if="this.$cookies.get('isadmin') != 1 && this.$cookies.get('token')">
        <sidenav-collapse navText="選課" :to="{ name: 'UserClass' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('isadmin') != 1 && this.$cookies.get('token')">
        <sidenav-collapse navText="我的課程" :to="{ name: 'MyClass' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <ul class="navbar-nav">
      <li class="nav-item" v-if="this.$cookies.get('isadmin') == 1">
        <sidenav-collapse navText="教授課程" :to="{ name: 'TeacherClass' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('isadmin') == 2">
        <sidenav-collapse navText="TA課程" :to="{ name: 'TAClass' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <hr class="mt-4 horizontal dark" v-if="this.$cookies.get('token')" />
    <ul class="navbar-nav">
      <li class="nav-item" v-if="this.$cookies.get('token')">
        <sidenav-collapse navText="我的影片" :to="{ name: 'MyVideo' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('token')">
        <sidenav-collapse navText="我的收藏" :to="{ name: 'MyFavorite' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('token')">
        <sidenav-collapse navText="觀看紀錄" :to="{ name: 'MyWatch' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <hr class="mt-4 horizontal dark" />
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse navText="靜宜大學" :to="{ name: 'PU' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="UVa" :to="{ name: 'UVa' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="CPE" :to="{ name: 'CPE' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
  },
  data() {
    return {
      controls: "dashboardsExamples",
      isActive: "active",
      user_account: this.$cookies.get("user_account"),
    };
  },
  components: {
    SidenavCollapse,
  },
};
</script>
