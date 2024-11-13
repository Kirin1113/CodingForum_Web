<template>
    <li class="mb-2">
        <a v-if="source['comment_id'] && source['post_id'] && !source['viewed']" class="dropdown-item border-radius-md" :class="[real_viewed == 0 ? 'notview' : 'viewed']" @click="gocomment">
            <div class="py-1 d-flex">
                <div class="my-auto">
                    <img :src="$global_url + source['comment_user_picture']" class="avatar avatar-sm me-3"
                        alt="user image" />
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">{{ source['comment_user_name'] }}</span>
                        在影片
                        <span class="font-weight-bold">{{ source['post_uva_show'] }} 作者: {{ source['post_user_name']
                        }}</span> 留言中tag了你
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <timeago :datetime="source['created_at'].replaceAll('/', '-')" />
                    </p>
                </div>
            </div>
        </a>
        <a v-if="source['comment_id'] && source['community_id'] && !source['viewed']" class="dropdown-item border-radius-md" :class="[real_viewed == 0 ? 'notview' : 'viewed']" @click="gocomment">
            <div class="py-1 d-flex">
                <div class="my-auto">
                    <img :src="$global_url + source['comment_user_picture']" class="avatar avatar-sm me-3"
                        alt="user image" />
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">{{ source['comment_user_name'] }}</span>
                        在文章
                        <span class="font-weight-bold">{{ source['community_title'] }} 作者: {{ source['community_user_name']
                        }}</span> 留言中tag了你
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <timeago :datetime="source['created_at'].replaceAll('/', '-')" />
                    </p>
                </div>
            </div>
        </a>
        <a v-if="!source['comment_id'] && source['post_id'] && !source['viewed']" class="dropdown-item border-radius-md" :class="[real_viewed == 0 ? 'notview' : 'viewed']" @click="govideo">
            <div class="py-1 d-flex">
                <div class="my-auto">
                    <img :src="$global_url + source['comment_user_picture']" class="avatar avatar-sm me-3"
                        alt="user image" />
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">{{ source['comment_user_name'] }}</span>
                        上傳了最新影片
                        <span class="font-weight-bold">{{ source['post_uva_show'] }}</span> 快去看看吧!
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <timeago :datetime="source['created_at'].replaceAll('/', '-')" />
                    </p>
                </div>
            </div>
        </a>
        <a v-if="!source['comment_id'] && source['community_id'] && !source['viewed']" class="dropdown-item border-radius-md" :class="[real_viewed == 0 ? 'notview' : 'viewed']" @click="govideo">
            <div class="py-1 d-flex">
                <div class="my-auto">
                    <img :src="$global_url + source['comment_user_picture']" class="avatar avatar-sm me-3"
                        alt="user image" />
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">{{ source['comment_user_name'] }}</span>
                        發表了最新文章
                        <span class="font-weight-bold">{{ source['community_title'] }}</span> 快去看看吧!
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <timeago :datetime="source['created_at'].replaceAll('/', '-')" />
                    </p>
                </div>
            </div>
        </a>
    </li>
</template>
  
<script>
export default {
    name: 'item-component',
    props: {
        source: { // 每一行的内容
            type: Object,
            default() {
                return {}
            }
        },
    },
    data() {
        return {
            real_viewed: this.source['viewed']
        };
    },
    methods: {
        gocomment() {
            if (this.real_viewed == 0) //沒看過然後看
                this.$parent.$parent.$parent.tagcount--
            this.axios
                .post("/api/forum/tag_viewed", {
                    tag_id: this.source['id']
                }, {
                })
            this.real_viewed = 1;
            const dropdownMenuButton = document.getElementById('dropdownMenuButton');
            const dropdownMenu = document.getElementById('dropdownMenu');
            dropdownMenuButton.classList.remove('show');
            dropdownMenu.classList.remove('show');
            if(this.source['post_id']) {
                this.$router.push({
                    name: 'Video', params: { post_id: this.source['post_id'], comment_id: this.source['comment_id'], }
                });
            } else if(this.source['community_id']) {
                this.$router.push({
                    name: 'Community', params: { community_id: this.source['community_id'], comment_id: this.source['comment_id'], }
                });
            }
        },
        govideo() {
            if (this.real_viewed == 0) //沒看過然後看
                this.$parent.$parent.$parent.tagcount--
            this.axios
                .post("/api/forum/tag_viewed", {
                    tag_id: this.source['id']
                }, {
                })
            this.real_viewed = 1;
            const dropdownMenuButton = document.getElementById('dropdownMenuButton');
            const dropdownMenu = document.getElementById('dropdownMenu');
            dropdownMenuButton.classList.remove('show');
            dropdownMenu.classList.remove('show');
            if(this.source['post_id']) {
                this.$router.push({
                    name: 'Video', params: { post_id: this.source['post_id'], comment_id: this.source['comment_id'], }
                });
            } else if(this.source['community_id']) {
                this.$router.push({
                    name: 'Community', params: { community_id: this.source['community_id'], comment_id: this.source['comment_id'], }
                });
            }
        }
    }
}
</script>

<style>
.notview {
    background-color: #e9ecef !important;
}

.viewed {
    background-color: #ffffff !important;

}

.dropdown-item:hover {
    background-color: #96adff66 !important;
}
</style>