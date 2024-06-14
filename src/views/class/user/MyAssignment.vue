<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <div class="card-body">
                        <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                            element-loading-background="rgb(248 248 248)">
                            <el-table :data="filteredAssignment" empty-text="目前尚無作業" :row-class-name="tableRowClassName">
                                <el-table-column label="作業名稱" prop="name" />
                                <el-table-column label="繳交狀態" sortable :sort-method="sortState" prop="hand_in_assignment_id"
                                    :min-width="window.innerWidth < 1200 ? '120%' : ''">
                                    <template #default="scope">
                                        <div v-if="scope.row.hand_in_assignment_id != null">
                                            已繳交
                                        </div>
                                        <div v-else>
                                            尚未繳交
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="開始時間" prop="start_at"
                                    :min-width="window.innerWidth < 1200 ? '180%' : ''" />
                                <el-table-column label="結束時間" prop="end_at"
                                    :min-width="window.innerWidth < 1200 ? '180%' : ''" />
                                <el-table-column label="開放狀態">
                                    <template #default="scope">
                                        <div v-if="scope.row.in_time">
                                            開放
                                        </div>
                                        <div v-else>
                                            關閉
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column align="right" min-width="250%">
                                    <template #header>
                                        <el-input v-model="search" placeholder="作業名稱搜尋" />
                                    </template>
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'AssignmentIntro', params: { coding_class_id: scope.row.coding_class_id, assignment_id: scope.row.id } }">
                                            <el-button class="mx-1 my-1">
                                                作業介紹
                                            </el-button>
                                        </router-link>
                                        <router-link
                                            :to="{ name: 'TempVideo', params: { temp_post_id: scope.row.temp_post_id } }"
                                            v-if="scope.row.temp_post_id != null" target='_blank'>
                                            <el-button class="mx-1 my-1">
                                                查看暫存作業影片
                                            </el-button>
                                        </router-link>
                                        <router-link
                                            :to="{ name: 'HandInAssignment', params: { coding_class_id: scope.row.coding_class_id, assignment_id: scope.row.id } }"
                                            v-if="scope.row.hand_in_assignment_id == null && scope.row.in_time == true">
                                            <el-button class="mx-1 my-1">
                                                繳交作業
                                            </el-button>
                                        </router-link>
                                        <el-button
                                            v-if="scope.row.hand_in_assignment_id == null && scope.row.in_time == false"
                                            disabled class="mx-1 my-1">
                                            不在繳交期限內
                                        </el-button>
                                        <router-link
                                            :to="{ name: 'HandInAssignment', params: { coding_class_id: scope.row.coding_class_id, assignment_id: scope.row.id, hand_in_assignment_id: scope.row.hand_in_assignment_id } }"
                                            v-if="scope.row.hand_in_assignment_id != null && scope.row.in_time == true">
                                            <el-button class="mx-1 my-1">
                                                編輯已繳作業
                                            </el-button>
                                        </router-link>
                                        <router-link
                                            :to="{ name: 'HandInAssignment', params: { coding_class_id: scope.row.coding_class_id, assignment_id: scope.row.id, hand_in_assignment_id: scope.row.hand_in_assignment_id } }"
                                            v-if="scope.row.hand_in_assignment_id != null && scope.row.in_time == false">
                                            <el-button class="mx-1 my-1">
                                                不可編輯，查看已繳作業
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
    name: "Assignment",
    components: {
        SoftButton,
        SelectUser
    },
    data() {
        return {
            search: '',
            Assignment: [],
            filteredAssignment: [],
            token: this.$cookies.get("token"),
            token_user_id: this.$cookies.get("user_id"),
            token_user_account: this.$cookies.get("account"),
            coding_class_id: this.$route.params.coding_class_id,
            data_loading: true
        };
    },
    created() {
        this.$watch(
            () => ({
                coding_class_id: this.coding_class_id,
            }),
            () => {
                if (this.$route.name != 'MyAssignment') {
                    return;
                }
                if (!this.coding_class_id) {
                    this.$router.push({ name: 'MyClass' });
                    return;
                }
                const that = this;
                this.axios
                    .post("/api/class/get_assignment", {
                        coding_class_id: this.coding_class_id
                    }, {
                        headers: {
                            'Authorization': `Bearer ` + this.token
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        this.Assignment = res.data.success
                        this.data_loading = false
                    }).catch(function (error) {
                        ElMessage.error(error.response.data.error)
                        that.$router.push({ name: 'MyClass' });
                    })
            },
            { deep: true, immediate: true }
        );
    },
    computed: {
        filteredAssignment() {
            return this.Assignment.filter((item) => {
                return item.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        sortState(a, b) {
            if (a.hand_in_assignment_id && !b.hand_in_assignment_id)
                return -1
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.hand_in_assignment_id == null && row.in_time == true) //繳交作業
                return 'none-row';
            if (row.hand_in_assignment_id == null && row.in_time == false) //不在繳交期限內
                return 'fail-row';
            if (row.hand_in_assignment_id != null && row.in_time == true) //編輯已繳作業
                return 'success-row';
            if (row.hand_in_assignment_id != null && row.in_time == false) //不可編輯，查看已繳作業
                return 'notedit-row';
        }
    }
}
</script>
  
<style>
.el-table tbody tr:hover>td {
    background-color: initial !important
}

.el-table .none-row {
    background-color: #06a1a480;
}

.el-table .fail-row {
    background-color: rgba(151, 151, 151, 0.479);
}

.el-table .success-row {
    background-color: #06a43b80;
}

.el-table .notedit-row {
    background-color: rgba(106, 158, 108, 0.479);
}

.blue-row {
    background-color: blue !important;
}

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