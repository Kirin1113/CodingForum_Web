<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">

                    <div class="card-body">

                        <router-link :to="{ name: 'TeacherClass' }"> <soft-button color="dark" full-width variant="gradient"
                                style="    font-size: 15px;">管理課程</soft-button></router-link>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>

import SoftButton from "@/components/SoftButton.vue";

export default {
    name: "AdminDashboard",
    components: {
        SoftButton,
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