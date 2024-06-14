<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <div class="card-body">
                        <form role="form" class="mx-auto col-xl-9">
                            <div class="mb-3">
                                <label>作業名稱</label>
                                <h5>{{ name }}</h5>
                            </div>
                            <div class="mb-3">
                                <label>作業內容</label>
                                <h5>{{ content }}</h5>
                            </div>
                            <div class="mb-3">
                                <label>作業檔案</label>
                                <ShowFileUpload ref="ShowFileUpload" />
                            </div>
                            <div class="line my-6"></div>
                            <div class="mb-3" v-show="type != 2">
                                <label>影片</label>
                                <SelectPost ref="SelectPost" :disabled="!in_time" />
                                <soft-button color="dark" variant="gradient" class="mt-2 mb-2"
                                    @click="this.$router.push({ name: 'Upload' });">尚未發片，去發片</soft-button>
                            </div>
                            <div class="mb-3" v-show="type != 1">
                                <label>檔案</label>
                                <FileUpload ref="FileUpload" :in_time="in_time" />
                            </div>
                            <div class="text-center">
                                <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                                    @click.stop.prevent="hand_in_assignment()" v-if="in_time">{{ showtext }}</soft-button>
                                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                                    @click.stop.prevent="$router.go(-1)">取消</soft-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import SoftButton from "@/components/SoftButton.vue";
import { ElMessage } from "element-plus";
import FileUpload from "@/components/FileUpload.vue";
import SelectPost from "@/components/SelectPost.vue";
import ShowFileUpload from "@/components/ShowFileUpload.vue";

export default {
    name: "HandInAssignment",
    components: {
        SoftButton,
        FileUpload,
        SelectPost,
        ShowFileUpload
    },
    data() {
        return {
            users: [],
            name: '',
            content: '',
            token: this.$cookies.get("token"),
            coding_class_id: this.$route.params.coding_class_id,
            assignment_id: this.$route.params.assignment_id,
            hand_in_assignment_id: this.$route.params.hand_in_assignment_id,
            showtext: '繳交作業',
            in_time: false,
            type: ''
        };
    },
    created() {
        this.$watch(
            () => ({
                coding_class_id: this.coding_class_id,
                assignment_id: this.assignment_id,
                hand_in_assignment_id: this.hand_in_assignment_id
            }),
            () => {
                if (this.$route.name != 'HandInAssignment') {
                    return;
                }
                if (!this.coding_class_id) {
                    this.$router.push({ name: 'MyClass' });
                    return;
                }
                if (!this.assignment_id) {
                    this.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                    return;
                }
                const that = this;
                this.axios
                    .post("/api/class/get_assignment", {
                        coding_class_id: this.coding_class_id,
                        assignment_id: this.assignment_id,
                    }, {
                        headers: {
                            'Authorization': `Bearer ` + this.token
                        }
                    })
                    .then((res) => {
                        if (this.hand_in_assignment_id && this.hand_in_assignment_id != res.data.success.hand_in_assignment_id) {
                            ElMessage.error('尚未繳交作業');
                            this.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                            return;
                        }

                        this.in_time = res.data.success.in_time
                        this.name = res.data.success.name
                        this.content = res.data.success.content
                        this.type = res.data.success.type
                        this.$refs.ShowFileUpload.files = res.data.success.file
                        if (this.in_time == false) {
                            if (!this.hand_in_assignment_id) {
                                ElMessage.error('不在繳交作業的期限內');
                                this.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                            }
                        }
                    }).catch(function (error) {
                        ElMessage.error(error.response.data.error);
                        that.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                    });
                if (this.hand_in_assignment_id) {
                    this.showtext = '更新作業'
                    this.axios
                        .post("/api/class/get_hand_in_assignment", {
                            hand_in_assignment_id: this.hand_in_assignment_id,
                        }, {
                            headers: {
                                'Authorization': `Bearer ` + this.token
                            }
                        })
                        .then((res) => {
                            console.log(res.data.success)
                            this.$refs.SelectPost.post_id = res.data.success.post_id
                            this.$refs.FileUpload.files = res.data.success.file
                        }).catch(function (error) {
                            ElMessage.error(error.response.data.error);
                            that.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                        });
                }
            },
            { deep: true, immediate: true }
        );
    },
    methods: {
        hand_in_assignment(updatefile) {
            const that = this;
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$router.push({ name: 'Sign In' });
            }
            var file_ = []
            if (this.type != 1) {
                var FileUpload = this.$refs.FileUpload.returnFiles();
                FileUpload.map(function (value, key) {
                    if (value.success)
                        file_.push({ 'name': value.name, 'size': value.size, "success": true, "progress": "100.00", "id": value.id })
                });
            }
            this.axios
                .post("/api/class/hand_in_assignment", {
                    assignment_id: this.assignment_id,
                    hand_in_assignment_id: this.hand_in_assignment_id,
                    post_id: this.type != 2 ? this.$refs.SelectPost.return_post_id() : '',
                    file: file_,
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    }
                })
                .then((res) => {
                    console.log(res);
                    if (updatefile != 1) {
                        this.$router.push({
                            name: 'MyAssignment', params: { coding_class_id: this.coding_class_id }
                        });
                        if (res.data.temp_post_id) {
                            window.open(
                                this.$router.resolve({
                                    name: 'TempVideo',
                                    params: { temp_post_id: res.data.temp_post_id }
                                }).href,
                                '_blank'
                            );
                        }
                        ElMessage({
                            message: res.data.success,
                            type: "success",
                            duration: 3000,
                        });
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        ElMessage.error(error.response.data.error);
                        that.$router.push({
                            name: 'MyAssignment', params: { coding_class_id: that.coding_class_id }
                        });
                    }
                });
        },
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