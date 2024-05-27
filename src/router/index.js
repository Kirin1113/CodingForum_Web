import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Upload from "@/views/Upload.vue";
import EditPost from "@/views/EditPost.vue";
import Video from "@/views/Video.vue";
// import TempVideo from "@/views/TempVideo.vue";
import Profile from "@/views/Profile.vue";
import SignIn from "@/views/user/SignIn.vue";
import SignUp from "@/views/user/SignUp.vue";
import ForgetPassword from "@/views/user/ForgetPassword.vue";
import ResetPassword from "@/views/user/ResetPassword.vue";
import ResendPassword from "@/views/user/ResendPassword.vue";
import EditUser from "@/views/user/EditUser.vue";
import EditPic from "@/views/user/EditPic.vue";
import EditCover from "@/views/user/EditCover.vue";
import EditPassword from "@/views/user/EditPassword.vue";
import AllUser from "@/views/AllUser.vue";
// import TeacherClass from "@/views/class/admin/TeacherClass.vue";
// import OperateTeacherClass from "@/views/class/admin/OperateTeacherClass.vue";
// import Assignment from "@/views/class/admin/Assignment.vue";
// import CheckAssignment from "@/views/class/admin/CheckAssignment.vue";
// import OperateAssignment from "@/views/class/admin/OperateAssignment.vue";
// import TAClass from "@/views/class/TA/TAClass.vue";
// import TAAssignment from "@/views/class/TA/TAAssignment.vue";
// import TACheckAssignment from "@/views/class/TA/TACheckAssignment.vue";
// import ClassUser from "@/views/class/ClassUser.vue";
// import UserClass from "@/views/class/user/UserClass.vue";
// import MyClass from "@/views/class/user/MyClass.vue";
// import MyAssignment from "@/views/class/user/MyAssignment.vue";
// import HandInAssignment from "@/views/class/user/HandInAssignment.vue";
// import AssignmentIntro from "@/views/class/user/AssignmentIntro.vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const PU = { template: "<div>PU</div>" };
const UVa = { template: "<div>UVa</div>" };
const CPE = { template: "<div>CPE</div>" };
const CTutorial= { template: "<div>CTutorial</div>" };
const CPPTutorial= { template: "<div>CPPTutorial</div>" };
const JAVATutorial= { template: "<div>JAVATutorial</div>" };
const PYTHONTutorial= { template: "<div>PYTHONTutorial</div>" };
const COnlineGDB= { template: "<div>COnlineGDB</div>" };
const CPPOnlineGDB= { template: "<div>CPPOnlineGDB</div>" };
const JAVAOnlineGDB= { template: "<div>JAVAOnlineGDB</div>" };
const PYTHONOnlineGDB= { template: "<div>PYTHONOnlineGDB</div>" };

function islogin(to, from, next) {
  if (!$cookies.get("token")) {
    ElMessage.error("請先登入以進行操作");
    next({ name: "Sign In" });
  } else {
    next();
  }
}

// function isadmin(to, from, next) {
//   return axios
//     .post(
//       "/api/auth/check/isadmin",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ` + $cookies.get("token"),
//         },
//       }
//     )
//     .then((response) => {
//       if (response.data.check == 1) {
//         next();
//       } else {
//         next("/");
//         ElMessage.error("權限不符");
//       }
//     });
// }
// function isTA(to, from, next) {
//   return axios
//     .post(
//       "/api/auth/check/isadmin",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ` + $cookies.get("token"),
//         },
//       }
//     )
//     .then((response) => {
//       if (response.data.check == 2) {
//         next();
//       } else {
//         next("/");
//         ElMessage.error("權限不符");
//       }
//     });
// }

function user_post_check(to, from, next) {
  const post_id = to.params.post_id;
  return axios
    .post(
      "/api/forum/check/user_post_check",
      {
        post_id: post_id,
      },
      {
        headers: {
          Authorization: `Bearer ` + $cookies.get("token"),
        },
      }
    )
    .then((response) => {
      if (response.data.check) {
        next();
      } else {
        next("/");
        ElMessage.error("權限不符");
      }
    });
}

const routes = [
  {
    path: "/ctutorial",
    beforeEnter() {
      location.href = "https://www.w3schools.com/c/index.php";
    },
    name: "CTutorial",
    component: CTutorial,
  },
  {
    path: "/cpptutorial",
    beforeEnter() {
      location.href = "https://www.w3schools.com/cpp/default.asp";
    },
    name: "CPPTutorial",
    component: CPPTutorial,
  },
  {
    path: "/javatutorial",
    beforeEnter() {
      location.href = "https://www.w3schools.com/java/default.asp";
    },
    name: "JAVATutorial",
    component: JAVATutorial,
  },
  {
    path: "/pythontutorial",
    beforeEnter() {
      location.href = "https://www.w3schools.com/python/default.asp";
    },
    name: "PYTHONTutorial",
    component: PYTHONTutorial,
  },
  {
    path: "/conlinegdb",
    beforeEnter() {
      location.href = "https://www.onlinegdb.com/online_c_compiler";
    },
    name: "COnlineGDB",
    component: COnlineGDB,
  },
  {
    path: "/cpponlinegdb",
    beforeEnter() {
      location.href = "https://www.onlinegdb.com/online_c++_compiler";
    },
    name: "CPPOnlineGDB",
    component: CPPOnlineGDB,
  },
  {
    path: "/javaonlinegdb",
    beforeEnter() {
      location.href = "https://www.onlinegdb.com/online_java_compiler";
    },
    name: "JAVAOnlineGDB",
    component: JAVAOnlineGDB,
  },
  {
    path: "/pythononlinegdb",
    beforeEnter() {
      location.href = "https://www.onlinegdb.com/online_python_compiler";
    },
    name: "PYTHONOnlineGDB",
    component: PYTHONOnlineGDB,
  },
  {
    path: "/uva",
    beforeEnter() {
      location.href = "https://onlinejudge.org/";
    },
    name: "UVa",
    component: UVa,
  },
  {
    path: "/pu",
    beforeEnter() {
      location.href = "https://www.pu.edu.tw/";
    },
    name: "PU",
    component: PU,
  },
  {
    path: "/cpe",
    beforeEnter() {
      location.href = "https://cpe.cse.nsysu.edu.tw/";
    },
    name: "CPE",
    component: CPE,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    redirect: { name: "Dashboard" },
  },
  {
    path: "/",
    name: "/",
    redirect: { name: "Dashboard" },
  },
  {
    path: "/home",
    name: "Dashboard",
    component: Dashboard,
  },

  {
    path: "/video/upload",
    name: "Upload",
    component: Upload,
    beforeEnter: islogin,
  },
  {
    path: "/video/:post_id?/:comment_id?",
    name: "Video",
    component: Video,
  },
  // {
  //   path: "/tempvideo/:temp_post_id?",
  //   name: "TempVideo",
  //   component: TempVideo,
  // },
  {
    path: "/video/:post_id?/edit",
    name: "EditPost",
    component: EditPost,
    beforeEnter: [islogin, user_post_check],
  },
  {
    path: "/profile/:user_account?",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/alluser",
    name: "AllUser",
    component: AllUser,
  },
  // {
  //   path: "/userclass",
  //   name: "UserClass",
  //   component: UserClass,
  //   beforeEnter: islogin,
  // },
  // {
  //   path: "/myclass",
  //   name: "MyClass",
  //   component: MyClass,
  //   beforeEnter: islogin,
  // },
  // {
  //   path: "/myclass/:coding_class_id?/classuser",
  //   name: "MyClassUser",
  //   component: ClassUser,
  //   beforeEnter: islogin, //已在Component裡確認是否為學生
  // },
  // {
  //   path: "/myclass/:coding_class_id?/myassignment",
  //   name: "MyAssignment",
  //   component: MyAssignment,
  //   beforeEnter: islogin, //已在Component裡確認是否為學生
  // },
  // {
  //   path: "/myclass/:coding_class_id?/myassignment/:assignment_id?/assignmentintro",
  //   name: "AssignmentIntro",
  //   component: AssignmentIntro,
  //   beforeEnter: islogin, //已在Component裡確認是否為學生
  // },
  // {
  //   path: "/myclass/:coding_class_id?/myassignment/:assignment_id?/handinassignment/:hand_in_assignment_id?/operate",
  //   name: "HandInAssignment",
  //   component: HandInAssignment,
  //   beforeEnter: islogin, //已在Component裡確認是否為學生
  // },
  {
    path: "/auth",
    name: "auth",
    children: [
      {
        path: "sign-in",
        name: "Sign In",
        component: SignIn,
      },
      {
        path: "sign-up",
        name: "Sign Up",
        component: SignUp,
      },
      {
        path: "forget_password",
        name: "forget_password",
        component: ForgetPassword,
      },
      {
        path: "reset_password/:reset_password_token",
        name: "reset_password",
        component: ResetPassword,
      },
      {
        path: "resend_password",
        name: "resend_password",
        component: ResendPassword,
      },
      {
        path: "edit_user",
        name: "EditUser",
        component: EditUser,
        beforeEnter: islogin,
      },
      {
        path: "edit_pic",
        name: "EditPic",
        component: EditPic,
        beforeEnter: islogin,
      },
      {
        path: "edit_cover",
        name: "EditCover",
        component: EditCover,
        beforeEnter: islogin,
      },
      {
        path: "edit_password",
        name: "EditPassword",
        component: EditPassword,
        beforeEnter: islogin,
      },
    ],
  },
  // {
  //   path: "/admin/:catchAll(.*)",
  //   name: "AdminNotFound",
  //   redirect: { name: "AdminDashboard" },
  // },
  // {
  //   path: "/admin",
  //   name: "Admin",
  //   beforeEnter: [islogin, isadmin],
  //   children: [
  //     {
  //       path: "",
  //       name: "",
  //       redirect: { name: "TeacherClass" },
  //     },
  //     {
  //       path: "teacherclass",
  //       name: "TeacherClass",
  //       component: TeacherClass,
  //     },
  //     {
  //       path: "teacherclass/:coding_class_id?/classuser",
  //       name: "TeacherClassUser",
  //       component: ClassUser,
  //       beforeEnter: islogin, //已在Component裡確認是否為學生
  //     },
  //     {
  //       path: "teacherclass/:coding_class_id?/operate",
  //       name: "OperateTeacherClass",
  //       component: OperateTeacherClass,
  //     },
  //     {
  //       path: "teacherclass/:coding_class_id?/assignment",
  //       name: "Assignment",
  //       component: Assignment,
  //     },
  //     {
  //       path: "teacherclass/:coding_class_id?/assignment/:assignment_id?/check",
  //       name: "CheckAssignment",
  //       component: CheckAssignment,
  //     },
  //     {
  //       path: "teacherclass/:coding_class_id?/assignment/:assignment_id?/operate",
  //       name: "OperateAssignment",
  //       component: OperateAssignment,
  //     },
  //   ],
  // },
  // {
  //   path: "/TA",
  //   name: "TA",
  //   beforeEnter: [islogin, isTA],
  //   children: [
  //     {
  //       path: "",
  //       name: "",
  //       redirect: { name: "TAClass" },
  //     },
  //     {
  //       path: "TAClass",
  //       name: "TAClass",
  //       component: TAClass,
  //     },
  //     {
  //       path: "TAClass/:coding_class_id?/classuser",
  //       name: "TAClassUser",
  //       component: ClassUser,
  //     },
  //     {
  //       path: "TAClass/:coding_class_id?/TAassignment",
  //       name: "TAAssignment",
  //       component: TAAssignment,
  //     },
  //     {
  //       path: "TAClass/:coding_class_id?/TAassignment/:assignment_id?/assignmentintro",
  //       name: "TAAssignmentIntro",
  //       component: AssignmentIntro,
  //     },
  //     {
  //       path: "TAClass/:coding_class_id?/TAassignment/:assignment_id?/check",
  //       name: "TACheckAssignment",
  //       component: TACheckAssignment,
  //     },
  //   ],
  // },
];

const router = createRouter({
  mode: "hash",
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
