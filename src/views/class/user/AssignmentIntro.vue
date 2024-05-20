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
                            <div class="mb-3" v-show="showfile">
                                <label>作業檔案</label>
                                <ShowFileUpload ref="ShowFileUpload" />
                            </div>
                            <div class="text-center">
                                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                                    @click.stop.prevent="$router.go(-1)">返回</soft-button>
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
            type: '',
            showfile: false
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
                if (this.$route.name != 'AssignmentIntro' && this.$route.name != 'TAAssignmentIntro') {
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
                        this.in_time = res.data.success.in_time
                        this.name = res.data.success.name
                        this.content = res.data.success.content
                        this.type = res.data.success.type
                        console.log(res.data.success.file)
                        if (res.data.success.file.length != 0) {
                            this.showfile = true
                        }
                        this.$refs.ShowFileUpload.files = res.data.success.file
                    }).catch(function (error) {
                        if (error.response) {
                            ElMessage.error(error.response.data.error);
                            that.$router.push({ name: 'MyAssignment', params: { coding_class_id: this.coding_class_id } });
                        }
                    });
            },
            { deep: true, immediate: true }
        );
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