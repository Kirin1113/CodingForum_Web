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
                                                    <div style="display: flex; align-items: flex-start;">
                                                        <!-- 上面的徽章 -->
                                                        <div v-if="user.subscriptions >= 31 && user.subscriptions < 62">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge11.png" 
                                                                style="width: 32px; height: 35px; margin-bottom: 10px;">
                                                        </div>
                                                        <div v-else-if="user.subscriptions >= 62 && user.subscriptions < 123">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge12.png" 
                                                                style="width: 32px; height: 37px; margin-bottom: 10px;">
                                                        </div>
                                                        <div v-else-if="user.subscriptions >= 123">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge13.png" 
                                                                style="width: 32px; height: 37px; margin-bottom: 10px;">
                                                        </div>

                                                        <!-- 下面的徽章 -->
                                                        <div v-if="user.follows >= 31 && user.follows < 62">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge21.png" 
                                                                style="width: 30px; height: 30px; margin-left: 5px; margin-top: 6px;">
                                                        </div>
                                                        <div v-else-if="user.follows >= 62 && user.follows < 123">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge22.png" 
                                                                style="width: 30px; height: 30px; margin-left: 5px; margin-top: 6px;">
                                                        </div>
                                                        <div v-else-if="user.follows >= 123">
                                                            <img src="http://localhost/Coding-platform/CodingPlatform_api/public/uploads/badge/badge23.png" 
                                                                style="width: 30px; height: 30px; margin-left: 5px; margin-top: 6px;">
                                                        </div>
                                                    </div>
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
