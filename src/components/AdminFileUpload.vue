<template>
    <div class="example-full">

        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
            <h3>Drop files to upload</h3>
        </div>
        <div class="upload" v-show="!isOption">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>名稱</th>
                            <th>大小</th>
                            <th>狀態</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!files.length">
                            <td colspan="9">
                                <div class="text-center p-5">
                                    <h4>拖移檔案到此處<br />或</h4>
                                    <label :for="name" class="btn btn-lg btn-primary">選擇檔案</label>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="(file, index) in files" :key="file.id">
                            <td>
                                <div class="filename">
                                    <a :href="$global_assignment_url + '/' + assignment_id + '/' + user_account + '/' + file.name"
                                        target="_blank">
                                        {{ file.name }}</a>

                                </div>
                                <div class="progress" v-if="file.active || file.progress !== '0.00'">
                                    <div :class="{ 'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active }"
                                        role="progressbar" :style="{ width: file.progress + '%', height: '20px' }">{{
                                            file.progress }}%
                                    </div>
                                </div>
                            </td>
                            <td>{{ formatSize(file.size) }}</td>

                            <td v-if="file.error">{{ file.error }}</td>
                            <td v-else-if="file.success">成功</td>
                            <td v-else-if="file.active">上傳中</td>
                            <td v-else></td>
                            <td>
                                <div class="btn-group">
                                    <el-button type="warning"
                                        v-if="file.error && file.error !== 'compressing' && file.error !== 'image parsing' && $refs.upload.features.html5"
                                        @click.prevent="$refs.upload.update(file, { active: true, error: '', progress: '0.00' })">Retry
                                        upload</el-button>
                                    <el-button type="danger" @click.prevent="$refs.upload.remove(file)">Remove</el-button>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="example-foorer">
                <div class="btn-group">
                    <file-upload ref="upload" class="btn btn-primary " :post-action="postAction" :extensions="extensions"
                        :accept="accept" :multiple="multiple" :size="size || 0"
                        :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)" :headers="headers" :drop="drop"
                        :add-index="addIndex" v-model="files" @input-file="inputFile">
                        選擇檔案
                    </file-upload>
                </div>
            </div>
        </div>


    </div>
</template>
    
<script>
import { ElMessage } from "element-plus";
import FileUpload from 'vue-upload-component'
export default {
    components: {
        FileUpload,
    },
    props: ["teacher"],

    data() {
        return {
            files: [],
            accept: '*',
            minSize: 1,//最小容量
            size: 1024 * 1024 * 10,//最大容量
            multiple: true,
            drop: true,
            addIndex: false,
            thread: 3,
            name: 'file',
            postAction: '/api/class/admin/upload_file',
            uploadAuto: true,
            coding_class_id: this.$route.params.coding_class_id,
            assignment_id: this.$route.params.assignment_id,
            hand_in_assignment_id: this.$route.params.hand_in_assignment_id,
            user_account: this.$cookies.get("account"),
        }
    },
    methods: {
        returnFiles() {
            return this.files;
        },
        formatSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
        },
        // add, update, remove File Event
        inputFile(newFile, oldFile) {

            if (newFile && oldFile) {
                // update

                if (newFile.active && !oldFile.active) {
                    // beforeSend
                    newFile.data = { 'assignment_id': this.assignment_id };
                    newFile.headers = { 'Authorization': 'Bearer ' + this.$cookies.get("token") }
                    // min size
                    if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize && newFile.type !== "text/directory") {
                        this.$refs.upload.update(newFile, { error: 'size' })
                    }
                }

                if (newFile.progress !== oldFile.progress) {
                    // progress
                }

                if (newFile.error && !oldFile.error) {

                }

                if (newFile.success && !oldFile.success) {
                    this.$parent.assignment(1);
                    ElMessage({
                        message: newFile.file.name + "上傳成功",
                        type: "success",
                        duration: 3000,
                    });
                }
            }


            if (!newFile && oldFile) {
                // remove
                const that = this;

                console.log(oldFile.name)
                if (oldFile.success) {
                    this.axios
                        .post("/api/class/admin/delete_file", {
                            file_name: oldFile.name,
                            assignment_id: this.assignment_id,
                        }, {
                            headers: {
                                'Authorization': `Bearer ` + this.$cookies.get("token")
                            }
                        })
                        .then((res) => {
                            ElMessage({
                                message: oldFile.name + "刪除成功",
                                type: "success",
                                duration: 3000,
                            });
                            this.$parent.assignment(1);
                        }).catch(function (error) {
                            ElMessage.error(error.response.data.error);
                            that.$router.push({
                                name: 'Assignment', params: { coding_class_id: that.coding_class_id }
                            });
                        });
                }
            }


            // Automatically activate upload
            if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                if (this.uploadAuto && !this.$refs.upload.active) {
                    this.$refs.upload.active = true
                }
            }
        },


    }
}
</script>

<style>
.example-full .btn-group .dropdown-menu {
    display: block;
    visibility: hidden;
    transition: all .2s
}

.example-full .btn-group:hover>.dropdown-menu {
    visibility: visible;
}

.example-full label.dropdown-item {
    margin-bottom: 0;
}

.example-full .btn-group .dropdown-toggle {
    margin-right: .6rem
}

.td-image-thumb {
    max-width: 4em;
    max-height: 4em;
}

.example-full .filename {
    margin-bottom: .3rem
}

.example-full .btn-is-option {
    margin-top: 0.25rem;
}

.example-full .example-foorer {
    padding: .5rem 0;
    border-top: 1px solid #e9ecef;
    border-bottom: 1px solid #e9ecef;
}


.example-full .edit-image img {
    max-width: 100%;
}

.example-full .edit-image-tool {
    margin-top: .6rem;
}

.example-full .edit-image-tool .btn-group {
    margin-right: .6rem;
}

.example-full .footer-status {
    padding-top: .4rem;
}

.example-full .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    opacity: .6;
    text-align: center;
    background: #000;
}

.example-full .drop-active h3 {
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
}
</style>