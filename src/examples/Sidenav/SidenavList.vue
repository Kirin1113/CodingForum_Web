<template>
  <!-- max-height-vh-100 h-100 -->
  <div class="w-auto h-auto collapse navbar-collapse " id="sidenav-collapse-main">
    <ul class="navbar-nav" style="    flex-direction: row!important;">
      <li class="nav-item">
        <sidenav-collapse navText="首頁" :to="{ name: 'Dashboard' }" class="m-0">
          <template #icon>
            <shop />
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse navText="同學列表" :to="{ name: 'AllUser' }" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>

    </ul>
    <ul class="navbar-nav" style="    flex-direction: row!important;">
      <li class="nav-item" v-if="this.$cookies.get('isadmin') != 1 && this.$cookies.get('token')">
        <sidenav-collapse navText="選課" :to="{ name: 'UserClass' }" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('isadmin') != 1 && this.$cookies.get('token')">
        <sidenav-collapse navText="我的課程" :to="{ name: 'MyClass' }" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>
    </ul>
    <ul class="navbar-nav" style="    flex-direction: row!important;">

      <li class="nav-item" v-if="this.$cookies.get('isadmin') == 1">
        <sidenav-collapse navText="教授課程" :to="{ name: 'TeacherClass' }" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item" v-if="this.$cookies.get('isadmin') == 2">
        <sidenav-collapse navText="TA" :to="{ name: 'TAClass' }" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse navText="開源" :to="{ name: 'OpenSource' }" target="_blank" class="m-0">
          <template #icon>
            <customer-support />
          </template>
        </sidenav-collapse>
      </li>
    </ul>
    <ul class="navbar-nav">


      <!-- <li class="mt-3 nav-item" v-if="user_account">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6 ms-2">
          個人
        </h6>
      </li> -->

      <!-- <li class="nav-item" v-if="user_account">
        <sidenav-collapse navText="上傳貼文" :to="{ name: 'Upload' }">
          <template #icon>
            <office />
          </template>
        </sidenav-collapse>
      </li>  -->
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

    </ul>
  </div>
  <!-- <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card :class="cardBg" textPrimary="Need Help?" textSecondary="Please check our docs"
      route="https://www.creative-tim.com/learning-lab/vue/overview/soft-ui-dashboard/" label="專案開源"
      icon="ni ni-diamond" />

  </div> -->
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import Shop from "../../components/Icon/Shop.vue";
import Office from "../../components/Icon/Office.vue";
import CreditCard from "../../components/Icon/CreditCard.vue";
import Box3d from "../../components/Icon/Box3d.vue";
import CustomerSupport from "../../components/Icon/CustomerSupport.vue";
import Document from "../../components/Icon/Document.vue";
import Spaceship from "../../components/Icon/Spaceship.vue";
import Settings from "../../components/Icon/Settings.vue";
import CodeCard from "./CodeCard.vue";
import SelectUva from "@/components/SelectUva.vue";
import SoftButton from "@/components/SoftButton.vue";

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
    SoftButton,
    SidenavCollapse,
    SidenavCard,
    Shop,
    Office,
    CreditCard,
    Box3d,
    CustomerSupport,
    Document,
    Spaceship,
    Settings,
    CodeCard,
    SelectUva
  },

  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    resetpost() {
      this.$nextTick(() => {
        this.$parent.$emit('resetpost')
        this.resetpostvalue++
      });
    },
    opensource() {
      window.open('https://github.com/likeyou600/CodingForum_web', '_blank');
    }

  },
};
</script>
