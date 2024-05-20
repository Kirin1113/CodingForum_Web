<template>
    <el-option :key="index" :label="'[' + source['star'] + '星]   ' + source['show']"
        :value="{ value: source['id'], serial: source['serial'], label: source['show'] }"></el-option>
</template>
  
<script>
export default {
    name: 'item-component',
    props: {
        index: { // 每一行的索引
            type: Number
        },
        source: { // 每一行的内容
            type: Object,
            default() {
                return {}
            }
        },
    }
}
</script>