<template>
    <li id="myDropdown" class="nav-item dropdown d-flex align-items-center pe-2">
        <a class="p-0 nav-link" :class="[
            textWhite ? textWhite : 'text-body', tagcount > 0 ? 'rednotification' : '']" id="dropdownMenuButton"
            data-bs-toggle="dropdown" aria-expanded="false">
            <i class="cursor-pointer fa fa-bell fa-xl"></i>
        </a>
        <p class=" mb-0" style="color:red" v-if="tagcount > 0">&nbsp{{ tagcount }}</p>
        <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4 mobileul" id="dropdownMenu"
            aria-labelledby="dropdownMenuButton">
            <soft-button color="info" full-width variant="gradient" class="mt-2 mb-2"
                @click="all_tag_view">全部已讀</soft-button>
            <virtual-list ref="VirtualList" :key="reload" style="max-height: 245px; overflow-y: auto;" :data-key="'id'"
                :data-sources="tags" :data-component="itemComponent" :keeps="20" />
        </ul>
    </li>
</template>

<script>
import virtualList from 'vue3-virtual-scroll-list'
import SoftButton from "@/components/SoftButton.vue";
import TagedCardNode from './TagedCardNode.vue';

export default {
    name: "TagedCard",
    components: {
        'virtual-list': virtualList,
        SoftButton
    },
    props: ["TagedCardkeyadd"],
    data() {
        return {
            token: this.$cookies.get("token"),
            tags: [],
            itemComponent: TagedCardNode,
            virtualoptions: [],
            reload: 0,
            tagcount: 0
        };
    },
    created() {
        this.axios
            .post("/api/forum/get_tags", {
            }, {
                headers: {
                    'Authorization': `Bearer ` + this.token
                }
            })
            .then((res) => {
                this.virtualoptions = res.data.success
                this.tags = this.virtualoptions;
                this.tagcount = res.data.count
                console.log(res.data.success)
                this.reload++;
            })
    },
    methods: {
        all_tag_view() {
            this.axios
                .post("/api/forum/all_tag_view", {
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    }
                })
                .then((res) => {
                    this.$emit("TagedCardkeyadd");
                })
        },
    },
};
</script>

<style>
#myDropdown .rednotification {
    color: red !important;
}

@media (min-width: 1200px) {}

@media (max-width: 1200px) {
    .mobileul {
        width: 85vw;
        top: 100% !important;
    }
}
</style>