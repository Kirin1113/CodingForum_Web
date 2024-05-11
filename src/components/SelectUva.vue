<template>
    <el-select ref="elselect" v-model="select_uva" popper-class="virtualSelect" @visible-change="visibleVirtualoptions"
        filterable remote :remote-method="remoteMethod" placeholder="請輸入題目編號或標題" no-data-text="找不到題目"
        loading-text="題目加載中...">
        <virtual-list ref="VirtualList" :key="reload" style="max-height: 245px; overflow-y: auto;" :data-key="'id'"
            :data-sources="uvas" :data-component="itemComponent" :keeps="20" />
    </el-select>
</template>
  
<script>

import virtualList from 'vue3-virtual-scroll-list'
import ElOptionNode from '@/components/el-option-node';

export default {
    name: "SelectUva",
    components: {
        'virtual-list': virtualList,
    },
    data() {
        return {
            uvas: [],
            itemComponent: ElOptionNode,
            virtualoptions: [],
            reload: 0,
            select_uva: null,
        };
    },
    created() {
        this.$watch(
            () => ({
                select_uva: this.select_uva,
            }),
            () => {
                // if (this.$route.name != 'Dashboard' || this.$route.name != 'Profile') {
                //     return;
                // }
                this.$nextTick(() => {
                    this.$parent.$parent.$emit('changepost', { type: 99, select_uva: this.select_uva })
                });
            },
            { deep: true }
        );
        this.axios
            .get("/api/forum/get_uva", {
            })
            .then((res) => {
                this.virtualoptions = res.data.success
                this.uvas = this.virtualoptions;
                this.reload++;
            })
    },

    methods: {
        return_select_uva() {
            return this.select_uva;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.reload++
                this.uvas = this.virtualoptions.filter(item => {
                    return item.show.toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                });
            } else {
                this.uvas = this.virtualoptions;
            }
        },
        visibleVirtualoptions(bool) {
            if (!bool) {
                // this.selreload++
            }
            if (this.select_uva) {
                this.$refs.VirtualList.scrollToIndex(this.select_uva.value - 3)

            }
        },

    },


}
</script>
  
<style >
.el-select-dropdown__item {
    width: 100%;
}

.el-select {
    display: block !important;
}
</style>