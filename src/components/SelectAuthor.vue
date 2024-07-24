<template>
    <el-select ref="elselect" v-model="author_id" filterable remote :remote-method="remoteMethod" 
        placeholder="請輸入作者姓名" no-data-text="找不到作者" loading-text="使用者加載中...">
        <el-option v-for="author in authors" :key="author.id" :label="author.name" :value="author.id" />
    </el-select>
</template>
  
<script>
export default {
    name: "SelectAuthor",
    data() {
        return {
            authors: [],
            virtualoptions: [],
            reload: 0,
            author_id: null,
        };
    },
    created() {
        this.$watch(
            () => ({
                author_id: this.author_id,
            }),
            () => {
                this.$nextTick(() => {
                    this.$parent.$emit('changepost', { type: 99, author_id: this.author_id });
                });
            },
            { deep: true }
        );
        this.axios
            .get("/api/auth/get_all_user", {
            })
            .then((res) => {
                this.virtualoptions = res.data.success
                this.authors = this.virtualoptions;
            })
    },
    methods: {
        return_author_id() {
            return this.author_id;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.reload++
                this.authors = this.virtualoptions.filter(item => {
                    return (item.account + '_' + item.name).toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                });
            } else {
                this.authors = this.virtualoptions;
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