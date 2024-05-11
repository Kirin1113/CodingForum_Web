<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">

                    <div class="card-body">
                        <router-link :to="{ name: 'OperateAssignment', params: { coding_class_id: this.coding_class_id } }">
                            <soft-button color="dark" full-width variant="gradient"
                                style="    font-size: 15px;">新增作業</soft-button></router-link>
                        <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                            element-loading-background="rgb(248 248 248)">
                            <el-table :data="filteredAssignment" style="width: 100%" empty-text="目前尚無作業">
                                <el-table-column label="作業名稱" prop="name" />
                                <el-table-column label="作業內容" prop="content"
                                    :min-width="window.innerWidth < 1200 ? '180%' : ''" />
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
                                <el-table-column label="繳交人數" prop="hand_in_count" />

                                <el-table-column align="right" min-width="250%">
                                    <template #header>
                                        <el-input v-model="search" placeholder="作業名稱搜尋" />
                                    </template>
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'CheckAssignment', params: { coding_class_id: this.coding_class_id, assignment_id: scope.row.id } }">
                                            <el-button class="mx-1 my-1">

                                                學生繳交狀況
                                            </el-button>
                                        </router-link>

                                        <router-link
                                            :to="{ name: 'OperateAssignment', params: { coding_class_id: this.coding_class_id, assignment_id: scope.row.id } }">
                                            <el-button class="mx-1 my-1">

                                                調整作業
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
                if (this.$route.name != 'Assignment') {
                    return;
                }
                if (!this.coding_class_id) {
                    this.$router.push({ name: 'TeacherClass' });

                } else {
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
                        })
                }
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



}
</script>
  
<style >
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