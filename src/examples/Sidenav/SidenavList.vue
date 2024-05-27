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
    </ul>
    <!-- <ul class="navbar-nav">
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
        <sidenav-collapse navText="TA" :to="{ name: 'TAClass' }" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul> -->
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
    <hr class="mt-4 horizontal dark" />
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse navText="C Tutorial" :to="{ name: 'CTutorial' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="C++ Tutorial" :to="{ name: 'CPPTutorial' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="JAVA Tutorial" :to="{ name: 'JAVATutorial' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="PYTHON Tutorial" :to="{ name: 'PYTHONTutorial' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <hr class="mt-4 horizontal dark" />
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse navText="Online C Compiler" :to="{ name: 'COnlineGDB' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="Online C++ Compiler" :to="{ name: 'CPPOnlineGDB' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="Online JAVA Compiler" :to="{ name: 'JAVAOnlineGDB' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="Online PYTHON Compiler" :to="{ name: 'PYTHONOnlineGDB' }" target="_blank" class="m-0 justify-content-center"></sidenav-collapse>
      </li>
    </ul>
    <!-- <ul class="navbar-nav">
      <li class="nav-item" v-if="this.$route.name == 'Dashboard' || this.$route.name == 'Profile'"
        :key="this.$route.name">
        <div class="relative  rounded-xl bg-deep-black px-3 py-3 text-white" style="font-size: 13px;">
          <div class="font-bold">
            <span>"貼文搜尋"</span>
            => [
            <div class="text-center" style="    display: inline-block;">
              <soft-button color="success" size="sm" variant="gradient" style="padding: 8px;
                  margin-bottom: 5px;" @click="resetpost">全部</soft-button>
            </div>
            <SelectUva :key="resetpostvalue" />
            <span>],<br></span>
            <span>"貼文排序方式"</span>
            => [
            <CodeCard type=0 sort='"最新發布" ' comment=" // 🕒🕒🕒🕒🕒 " />
            <CodeCard type=1 sort='"最早發布" ' comment=" // 🕒 " />
            <CodeCard type=2 sort='"最多愛心" ' comment=" // ❤️❤️❤️❤️❤️ " />
            <CodeCard type=3 sort='"最少愛心" ' comment=" // ❤️ " />
            <CodeCard type=4 sort='"最多留言" ' comment=" //💬💬💬💬💬 " />
            <CodeCard type=5 sort='"最少留言" ' comment=" //💬" />
            <span class="font-bold"><br>],<br></span>
            <span>"貼文CPE星數"</span>
            => [<br>
            <CodeCard type=6 sort='"全部" ' comment="" /><br>
            <CodeCard type=7 sort='"0星" ' comment="" />
            <CodeCard type=8 sort='"1星" ' comment="" />
            <CodeCard type=9 sort='"2星" ' comment="" />
            <CodeCard type=10 sort='"3星" ' comment="" />
            <CodeCard type=11 sort='"4星" ' comment="" />
            <CodeCard type=12 sort='"5星" ' comment="" />
            <span class="font-bold"><br>],<br></span>
            <span>"貼文程式語言"</span>
            => [<br>
            <CodeCard type=13 sort='"全部" ' comment="" /><br>
            <CodeCard type=14 sort='"&nbsp;&nbsp;&nbsp;&nbsp;C&nbsp;&nbsp;&nbsp;&nbsp;"' comment="" />
            <CodeCard type=15 sort='"C++" ' comment="" />
            <br>
            <CodeCard type=16 sort='"Java" ' comment="" />
            <CodeCard type=17 sort='"Python" ' comment="" />
            <span class="font-bold"><br>],</span>
          </div>
        </div>
      </li>
    </ul> -->
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
// import CodeCard from "./CodeCard.vue";
// import SelectUva from "@/components/SelectUva.vue";
// import SoftButton from "@/components/SoftButton.vue";

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
      resetpostvalue: 0
    };
  },
  components: {
    SidenavCollapse,
    // CodeCard,
    // SelectUva,
    // SoftButton,
  },
  methods: {
    resetpost() {
      this.$nextTick(() => {
        this.$parent.$emit('resetpost')
        this.resetpostvalue++
      });
    }
  },
};
</script>
