<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <div class="card-body">
                        <soft-button color="dark" full-width variant="gradient" style="    font-size: 15px;"
                            @click="ouput_file" v-if="file_exist">匯出所有學生所交檔案</soft-button>
                        <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                            element-loading-background="rgb(248 248 248)">
                            <el-table :data="filteruser" style="width: 100%" empty-text="目前尚無學生修課" ref="table"
                                :row-class-name="tableRowClassName">
                                <el-table-column label="學生學號" prop="account"
                                    :min-width="window.innerWidth < 1200 ? '120%' : ''" />
                                <el-table-column label="學生名稱" :min-width="window.innerWidth < 1200 ? '120%' : ''">
                                    <template #default="scope">
                                        <router-link :to="{ name: 'Profile', params: { user_account: scope.row.account } }"
                                            target='_blank'>
                                            {{ scope.row.name }}
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column label="繳交狀態" sortable :sort-method="statussortState" prop="user_assignment"
                                    :min-width="window.innerWidth < 1200 ? '120%' : ''">
                                    <template #default="scope">
                                        <div v-if="scope.row.user_assignment">
                                            已繳交
                                        </div>
                                        <div v-else>
                                            尚未繳交
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="批改紀錄" sortable :sort-method="sortState"
                                    prop="user_assignment.status" :min-width="window.innerWidth < 1200 ? '180%' : ''">
                                    <template #default="scope">
                                        <div v-if="scope.row.user_assignment">
                                            <el-checkbox :model-value="scope.row.user_assignment.status == 1 ?? true"
                                                :label="scope.row.user_assignment.status == 1 ? '已記錄批改' : '未批改'"
                                                size="large" border
                                                @change="correct_hand_in_assignment(scope.row.user_assignment.assignment_id, scope.row.user_assignment.user_id)" />
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="right" :min-width="window.innerWidth < 1200 ? '250%' : ''">
                                    <template #header>
                                        <el-input v-model="search" placeholder="學生學號 名稱搜尋" />
                                    </template>
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'TempVideo', params: { temp_post_id: scope.row.user_assignment.temp_post_id } }"
                                            v-if="scope.row.user_assignment && scope.row.user_assignment.temp_post_id"
                                            target='_blank'>
                                            <el-button>
                                                查看暫存影片
                                            </el-button>
                                        </router-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
import SelectUser from '@/components/SelectUser.vue';

export default {
    name: "CheckAssignment",
    components: {
        SoftButton,
        SelectUser
    },
    data() {
        return {
            users: [],
            search: '',
            get_hand_in_assignment: [],
            filteruser: [],
            token: this.$cookies.get("token"),
            token_user_id: this.$cookies.get("user_id"),
            token_user_account: this.$cookies.get("account"),
            coding_class_id: this.$route.params.coding_class_id,
            assignment_id: this.$route.params.assignment_id,
            data_loading: true,
            file_exist: false,
            finishloading: 0,
        };
    },
    created() {
        this.$watch(
            () => ({
                coding_class_id: this.coding_class_id,
            }),
            () => {
                if (this.$route.name != 'CheckAssignment') {
                    return;
                }
                if (!this.coding_class_id) {
                    this.$router.push({ name: 'TeacherClass' });
                    return
                }
                if (!this.assignment_id) {
                    this.$router.push({ name: 'Assignment', params: { coding_class_id: this.coding_class_id } });
                    return
                }
                this.axios
                    .post("/api/class/admin/get_teacher_class", {
                        coding_class_id: this.coding_class_id
                    }, {
                        headers: {
                            'Authorization': `Bearer ` + this.token
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        this.users = res.data.success.user
                        this.finishloading++
                    })
                this.axios
                    .post("/api/class/get_hand_in_assignment", {
                        assignment_id: this.assignment_id
                    }, {
                        headers: {
                            'Authorization': `Bearer ` + this.token
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        this.get_hand_in_assignment = res.data.success

                        this.get_hand_in_assignment.forEach((hand_in_assignment) => {
                            if (hand_in_assignment.file.length > 0) {
                                this.file_exist = true
                                return
                            }
                        })
                        this.finishloading++
                    })
            },
            { deep: true, immediate: true }
        );
        this.$watch(
            () => ({
                finishloading: this.finishloading,
            }),
            () => {
                if (this.$route.name != 'CheckAssignment') {
                    return;
                }
                if (this.finishloading == 2) {
                    this.users.forEach((user, index1) => {
                        this.get_hand_in_assignment.forEach((user_assignment, index2) => {
                            if (user.id == user_assignment.user_id) {
                                const newObj = { ...this.users[index1], user_assignment };
                                this.users.splice(index1, 1, newObj);
                                return
                            }
                        })
                    })
                    this.data_loading = false
                    this.$nextTick(() => {
                        this.$refs.table.sort('user_assignment', 'ascending')
                    })
                }
            },
            { deep: true, immediate: true }
        );
        this.$watch(
            () => ({
                search: this.search,
            }),
            () => {
                if (this.$route.name != 'CheckAssignment') {
                    return;
                }
                this.$nextTick(() => {
                    this.$refs.table.sort('user_assignment', 'ascending')
                })
            },
            { deep: true, immediate: true }
        );
    },
    computed: {
        filteruser() {
            return this.users.filter((item) => {
                return (item.account + item.name).toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        correct_hand_in_assignment(assignment_id, user_id) {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$router.push({ name: 'Sign In' });
            }
            this.axios
                .post("/api/class/admin/correct_hand_in_assignment", {
                    assignment_id: assignment_id,
                    user_id: user_id
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    },
                })
                .then((res) => {
                    console.log(this.users)
                    const targetObj = this.users.find(item => item.id == user_id);
                    if (targetObj) {
                        targetObj.user_assignment.status = res.data.status;
                    }
                    ElMessage({
                        message: res.data.success,
                        type: "success",
                        duration: 3000,
                    });
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response);
                        ElMessage.error(error.response.data.error);
                    }
                });
        },
        sortState(a, b) {
            if (a.user_assignment && !b.user_assignment)
                return -1
        },
        statussortState(a, b) {
            if (a.user_assignment && b.user_assignment)
                if (a.user_assignment.status && b.user_assignment.status)
                    return -1
        },
        ouput_file() {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$router.push({ name: 'Sign In' });
            }
            this.axios
                .post("/api/class/admin/ouput_file", {
                    assignment_id: this.assignment_id
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    },
                    responseType: 'blob',
                })
                .then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', decodeURIComponent(res.headers.filename)); // Set the desired file name
                    document.body.appendChild(link);
                    link.click();
                    ElMessage({
                        message: "匯出成功",
                        type: "success",
                        duration: 3000,
                    });
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response);
                        ElMessage.error(error.response.data.error);
                    }
                });
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.user_assignment) //繳交作業
                return 'success-row';
            else
                return 'fail-row';
        }
    },
}
</script>
  
<style>
.el-select-dropdown__item {
    width: 300px;
    width: 100%;
}

.el-select {
    display: block !important;
}

.codemirror-container {
    display: block;
}
</style>

<style scoped>
@media (min-width: 1200px) {
    .video_pic {
        width: 20%;
    }
}

@media (max-width: 1200px) {
    .video_pic {
        width: 100%;
    }
}
</style>