<template>
    <el-select ref="elselect" multiple v-model="real_TA_user_ids" filterable remote :remote-method="remoteMethod"
        :placeholder="placeholder" no-data-text="找不到TA" loading-text="使用者加載中..." :disabled="disabled">
        <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
    </el-select>
</template>
  
<script>
export default {
    name: "SelectUser",
    props: ["TA_user_ids", "disabled"],
    data() {
        return {
            users: [],
            virtualoptions: [],
            real_TA_user_ids: this.TA_user_ids,
            reload: 0,
            placeholder: ''
        };
    },
    created() {
        if (this.disabled)
            this.placeholder = '此課程無TA'
        else
            this.placeholder = '請輸入TA或選擇TA'
        this.axios
            .get("/api/auth/get_all_user", {
            })
            .then((res) => {
                this.virtualoptions = res.data.success
                this.users = this.virtualoptions;
            })
    },
    methods: {
        return_TA_user_ids() {
            return this.real_TA_user_ids;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.reload++
                this.users = this.virtualoptions.filter(item => {
                    return (item.account + '_' + item.name).toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                });
            } else {
                this.users = this.virtualoptions;
            }
        },
    },
}
</script>
  
<style>
.el-select-dropdown__item {
    width: 100%;
}

.el-select {
    display: block !important;
}
</style>