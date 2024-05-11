<template>
  <nav aria-label="breadcrumb">
    <ol class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb me-sm-6">
      <li class="text-sm breadcrumb-item" :class="textWhite">
        <router-link :to="{ name: '/' }">
          {{ $app_name }}
        </router-link>
      </li>

      <li class="text-sm breadcrumb-item active" :class="textWhite ? 'text-white' : 'text-dark'" aria-current="page"
        v-for="list in lists.list">
        <router-link :to="{ name: list.route_name, params: list.params }">
          {{ list.name }}
        </router-link>
      </li>
    </ol>
    <h6 class="mb-0 font-weight-bolder" :class="textWhite ? 'text-white' : ''">
      {{ lists.name }}
    </h6>
  </nav>
</template>

<script>
export default {
  name: "breadcrumbs",
  data() {
    return {
      lists: [],
      showtext: [],
    };
  },
  created() {
    this.$watch(
      () => ({
        fullPath: this.$route.fullPath
      }),
      () => {
        this.list = []
        this.showtext = [{
          route_name: 'Dashboard',
          name: '首頁',
        }, {
          route_name: 'Profile',
          name: '個人頁面',
        }, {
          route_name: 'EditUser',
          name: '編輯用戶',
        }, {
          route_name: 'EditPic',
          name: '編輯頭貼',
        }, {
          route_name: 'EditCover',
          name: '編輯封面',
        }, {
          route_name: 'EditPassword',
          name: '修改密碼',
        }, {
          route_name: 'Upload',
          name: '上傳影片',
        }, {
          route_name: 'Video',
          name: '影片',
        },
        {
          route_name: 'TempVideo',
          name: '作業暫存影片',
        }, {
          route_name: 'EditPost',
          name: '編輯影片',
          list: [{ route_name: 'Video', name: '影片', params: { post_id: this.$route.params.post_id } }]
        }, {
          route_name: 'AllUser',
          name: '所有使用者',
        },


        {
          route_name: 'UserClass',
          name: '選課系統',
        }, {
          route_name: 'MyClass',
          name: '我的課程',
        }, {
          route_name: 'MyClassUser',
          name: '課堂同學',
          list: [{ route_name: 'MyClass', name: '我的課程' }]
        }, {
          route_name: 'MyAssignment',
          name: '作業',
          list: [{ route_name: 'MyClass', name: '我的課程' }]
        }, {
          route_name: 'AssignmentIntro',
          name: '作業介紹',
          list: [{ route_name: 'MyClass', name: '我的課程' }, { route_name: 'MyAssignment', name: '作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        }, {
          route_name: 'HandInAssignment',
          name: '繳交作業',
          list: [{ route_name: 'MyClass', name: '我的課程' }, { route_name: 'MyAssignment', name: '作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        },


        {
          route_name: 'TeacherClass',
          name: '教授課程',
        }, {
          route_name: 'TeacherClassUser',
          name: '課堂同學',
          list: [{ route_name: 'TeacherClass', name: '教授課程' }]
        }, {
          route_name: 'OperateTeacherClass',
          name: '操作課程',
          list: [{ route_name: 'TeacherClass', name: '教授課程' }]
        }, {
          route_name: 'Assignment',
          name: '課程作業',
          list: [{ route_name: 'TeacherClass', name: '教授課程' }]
        }, {
          route_name: 'CheckAssignment',
          name: '學生繳交狀況',
          list: [{ route_name: 'TeacherClass', name: '教授課程' }, { route_name: 'Assignment', name: '課程作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        }, {
          route_name: 'OperateAssignment',
          name: '操作課程作業',
          list: [{ route_name: 'TeacherClass', name: '教授課程' }, { route_name: 'Assignment', name: '課程作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        },


        {
          route_name: 'TAClass',
          name: 'TA課程',
        }, {
          route_name: 'TAClassUser',
          name: '課堂同學',
          list: [{ route_name: 'TAClass', name: 'TA課程' }]
        }, {
          route_name: 'TAAssignment',
          name: '查看作業',
          list: [{ route_name: 'TAClass', name: 'TA課程' }]
        }, {
          route_name: 'TAAssignmentIntro',
          name: '作業介紹',
          list: [{ route_name: 'TAClass', name: 'TA課程' }, { route_name: 'TAAssignment', name: '查看作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        }, {
          route_name: 'TACheckAssignment',
          name: '學生繳交狀況',
          list: [{ route_name: 'TAClass', name: 'TA課程' }, { route_name: 'TAAssignment', name: '查看作業', params: { coding_class_id: this.$route.params.coding_class_id } }]
        },
        ]
        const targetObj = this.showtext.find(item => item.route_name == this.$route.name);
        if (targetObj) {
          this.lists = targetObj;
        }
      },
      { deep: true, immediate: true }
    );
  },

  props: {
    currentPage: {
      required: true,
    },
    textWhite: {
      type: String,
    },
  },
};
</script>
