<template>
    <el-select 
        ref="elselect" 
        v-model="select_cpe" 
        popper-class="virtualSelect" 
        @visible-change="visibleVirtualoptions"
        filterable 
        remote 
        :remote-method="remoteMethod" 
        placeholder="請輸入題目編號或標題" 
        no-data-text="找不到題目"
        loading-text="題目加載中..."
        @change="updateSelectedCpe"
    >
        <virtual-list 
            ref="VirtualList" 
            :key="reload" 
            style="max-height: 245px; overflow-y: auto;" 
            :data-key="'id'"
            :data-sources="cpes" 
            :data-component="itemComponent" 
            :keeps="20" 
        />
    </el-select>
</template>
  
<script>
import virtualList from 'vue3-virtual-scroll-list';
import ElOptionNode from '@/components/el-option-node';

export default {
    name: "SelectFortynine",
    components: {
        'virtual-list': virtualList,
    },
    data() {
        return {
            cpes: [],
            cpe: [],  // 用來儲存選擇的 UVA 題目
            itemComponent: ElOptionNode,
            virtualoptions: [],
            reload: 0,
            select_cpe: null,
        };
    },
    created() {
        this.$watch(
            () => ({
                select_cpe: this.select_cpe,
            }),
            () => {
                this.$nextTick(() => {
                    if (this.select_cpe && this.select_cpe.serial) {
                        this.$emit('updateSerial', this.select_cpe.serial, this.cpe);
                    }
                });
            },
            { deep: true }
        );

        this.axios.get("/api/forum/get_uva_code")
            .then((res) => {
                this.virtualoptions = res.data.success;
                this.cpes = this.virtualoptions;
                this.reload++;
            });
    },
    methods: {
        return_select_cpe() {
            return this.select_cpe;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.reload++;
                this.cpes = this.virtualoptions.filter(item => {
                    return item.show.toLowerCase().indexOf(query.toLowerCase()) > -1;
                });
            } else {
                this.cpes = this.virtualoptions;
            }
        },
        visibleVirtualoptions(bool) {
            if (this.select_cpe) {
                this.$refs.VirtualList.scrollToIndex(this.select_cpe.value - 3);
            }
        },
        updateSelectedCpe() {
            const selectedCpe = this.virtualoptions.find(item => item.id === this.select_cpe.value);
            if (selectedCpe) {
                this.cpe = selectedCpe; // 儲存整個物件
                this.$emit('updateSerial', selectedCpe.serial, this.cpe); // 更新 serial 和整個 cpe
            }
        }
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