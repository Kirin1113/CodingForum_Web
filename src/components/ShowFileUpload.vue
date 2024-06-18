<template>
    <div class="example-full">
        <div class="upload" v-show="!isOption">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>名稱</th>
                            <th>大小</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(file, index) in files" :key="file.id">
                            <td>
                                <div class="filename">
                                    <a :href="$global_assignment_url + assignment_id + '/' + file.name"
                                        target="_blank">
                                        {{ file.name }}</a>
                                </div>
                            </td>
                            <td>{{ formatSize(file.size) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
    
<script>
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
            drop: false,
            addIndex: false,
            thread: 3,
            name: 'file',
            uploadAuto: true,
            coding_class_id: this.$route.params.coding_class_id,
            assignment_id: this.$route.params.assignment_id,
            hand_in_assignment_id: this.$route.params.hand_in_assignment_id,
            user_account: this.$cookies.get("account"),
        }
    },
    methods: {
        formatSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
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