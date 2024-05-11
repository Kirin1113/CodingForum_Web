<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">

                    <div class="card-body">
                        <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                            element-loading-background="rgb(248 248 248)">
                            <el-table :data="filteredCodingClasses" style="width: 100%" empty-text="目前尚無課程">
                                <el-table-column label="學年度" prop="school_year" />
                                <el-table-column label="課程名稱" prop="name"
                                    :min-width="window.innerWidth < 1200 ? '120%' : ''" />
                                <el-table-column label="目前加選人數" prop="student_count"
                                    :min-width="window.innerWidth < 1200 ? '120%' : ''">
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'MyClassUser', params: { coding_class_id: scope.row.id } }">
                                            <el-button>
                                                {{ scope.row.student_count }}
                                            </el-button>
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column label="課程教授">
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'Profile', params: { user_account: scope.row.teacher_account } }">
                                            {{ scope.row.teacher_name }}
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column label="TA" :min-width="window.innerWidth < 1200 ? '250%' : ''">
                                    <template #default="scope">
                                        <SelectUser :TA_user_ids="scope.row.TA_user_ids" :disabled=true />
                                    </template>
                                </el-table-column>
                                <el-table-column align="right" :min-width="window.innerWidth < 1200 ? '180%' : ''">
                                    <template #header>
                                        <el-input v-model="search" placeholder="課程名稱搜尋" />
                                    </template>
                                    <template #default="scope">
                                        <router-link
                                            :to="{ name: 'MyAssignment', params: { coding_class_id: scope.row.id } }">
                                            <el-button>
                                                查看作業
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
    name: "UserClass",
    components: {
        SoftButton,
        SelectUser
    },
    data() {
        return {
            search: '',
            CodingClasses: [],
            filteredCodingClasses: [],
            token: this.$cookies.get("token"),
            token_user_id: this.$cookies.get("user_id"),
            token_user_account: this.$cookies.get("account"),
            data_loading: true,
        };
    },
    created() {
        this.axios
            .post("/api/class/get_user_class", {
            }, {
                headers: {
                    'Authorization': `Bearer ` + this.token
                }
            })
            .then((res) => {
                console.log(res.data.success)
                this.CodingClasses = res.data.success
                this.data_loading = false;
            }
            )
    },
    computed: {
        filteredCodingClasses() {
            return this.CodingClasses.filter((item) => {
                return item.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {

        user_class(coding_class_id) {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$router.push({ name: 'Sign In' });
            }
            this.axios
                .post("/api/class/user_class", {
                    coding_class_id: coding_class_id
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    }
                })
                .then((res) => {

                    console.log(res);

                    this.$router.push({
                        name: 'UserClass'
                    }).then(() => { this.$router.go() });

                    ElMessage({
                        message: "加選成功",
                        type: "success",
                        duration: 3000,
                    });
                })
                .catch(function (error) {
                    if (error.response) {
                        ElMessage.error(error.response.data.error);

                    }
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