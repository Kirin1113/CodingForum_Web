<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <el-main style="padding:0" v-loading="data_loading" element-loading-text="載入中"
                        element-loading-background="rgb(248 248 248)">
                        <div class="card-body">
                            <h5>教授</h5>
                            <div class="container-fluid p-0" v-for="teacher in teachers">

                                <router-link class="" :to="{ name: 'Profile', params: { user_account: teacher.account } }">

                                    <div class="mt-4  overflow-hidden card card-body blur shadow-blur user_cover" :style="{
                                        backgroundImage:
                                            'url(' + $global_url + teacher.cover + ')',
                                        backgroundPositionY: '50%',
                                        backgroundSize: 'cover'
                                    }">
                                        <div class="row gx-4">
                                            <div class="col-auto">
                                                <div class="avatar avatar-xl position-relative">
                                                    <img :src="$global_url + teacher.picture" alt=""
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
                                                        {{ teacher.name }}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                            <div class="line my-5"></div>
                            <h5>TA</h5>
                            <div class="container-fluid p-0" v-for="TA in TAs">

                                <router-link class="" :to="{ name: 'Profile', params: { user_account: TA.account } }">

                                    <div class="mt-4  overflow-hidden card card-body blur shadow-blur user_cover" :style="{
                                        backgroundImage:
                                            'url(' + $global_url + TA.cover + ')',
                                        backgroundPositionY: '50%',
                                        backgroundSize: 'cover'
                                    }">
                                        <div class="row gx-4">
                                            <div class="col-auto">
                                                <div class="avatar avatar-xl position-relative">
                                                    <img :src="$global_url + TA.picture" alt=""
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
                                                        {{ TA.name }}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                            <div class="line my-5"></div>
                            <h5>學生</h5>
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


export default {

    data() {
        return {
            users: [],
            TAs: [],
            teachers: [],
            data_loading: true,
            token: this.$cookies.get("token"),
            coding_class_id: this.$route.params.coding_class_id,

        };
    },
    created() {
        this.axios
            .post("/api/class/get_class_user", {
                coding_class_id: this.coding_class_id
            }, {
                headers: {
                    'Authorization': `Bearer ` + this.token
                }
            })
            .then((res) => {
                this.users = res.data.user
                this.TAs = res.data.TA
                this.teachers = res.data.teacher
                this.data_loading = false
                console.log(res.data.success);
            })
    },

};
</script>
