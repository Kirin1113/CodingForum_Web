<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                        element-loading-background="rgb(248 248 248)">
                        <div class="card-body">

                            <div class="container-fluid p-0" v-for="user in users">

                                <router-link class="" :to="{ name: 'Profile', params: { user_account: user.account } }">

                                    <div class="mt-4  overflow-hidden card card-body blur shadow-blur user_cover" :style="{
                                        backgroundImage:
                                            'url(' + $global_url + user.cover + ')',
                                        backgroundPositionY: '50%',
                                        backgroundSize: 'cover'
                                    }">
                                        <div class="row gx-4">
                                            <div class="col-auto">
                                                <div class="avatar avatar-xl position-relative">
                                                    <img :src="$global_url + user.picture" alt=""
                                                        class="shadow-sm w-100 border-radius-lg"
                                                        style="background-color: antiquewhite;" />
                                                </div>
                                            </div>
                                            <div class="col-auto my-auto">
                                                <div class="h-100">
                                                    <h5 class="mb-1" style="    
                            background-color: #ffffffcf;
                            color: black;
                            border-radius: 5px;">
                                                        {{ user.name }}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </el-main>

                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ElMessage } from "element-plus";

import SoftButton from "../components/SoftButton.vue";

export default {
    name: "alluser",
    components: {
        SoftButton
    },
    data() {
        return {
            users: [],
            data_loading: true
        };
    },
    created() {
        this.axios
            .get("/api/auth/get_all_user", {
            }, {
            })
            .then((res) => {
                this.users = res.data.success
                this.data_loading = false
                console.log(res.data.success);
            })
    },

};
</script>
