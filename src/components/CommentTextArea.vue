<template>
    <div>
        <QuillEditor ref="editor" theme="snow" v-model:content="incontent" contentType="html" :options="editorOptions"
            :readOnly="readOnly" :placeholder="placeholder"
            :class="[readOnly ? 'read ql-container ql-snow ql-disabled' : 'ql-container ql-snow ']" :key="key" />
    </div>
    <!-- {{ all_user }} -->
    <!-- {{ incontent }} -->
    <!-- {{ value }} -->
</template>

<script>
import Quill from 'quill'
import mention from 'quill-mention' // 引入mention 组件
import 'quill-mention/dist/quill.mention.min.css'
import { ElMessage } from "element-plus";

Quill.register({
    'modules/mention': mention,
})

export default {
    name: "test",
    components: {
    },
    mounted() {
        window.addEventListener('mention-clicked', (event) => {
            console.log('hovered: ', event.value.id)
            this.$router.push({ name: 'Profile', params: { user_account: event.value.id } });

        }, false);

    },
    props: ["content", "readOnly", "newcomment", "newchildcomment", "comment_id", "change_readOnly", "all_user", "updatevalue", "parent_comment_id", "type"],
    //type: 0影片留言 1父 ，2child
    created() {
        this.$watch(
            () => ({
                readOnly: this.readOnly,
            }),
            () => {
                if (this.$route.name != 'Video') {
                    return;
                }
                this.key++
                if (this.readOnly == true) {

                }
            },
            { deep: true, immediate: true }
        );
    },
    methods: {
        comment() {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$cookies.set("go_login_then_backpost", this.post_id, "3min");
                this.$router.push({ name: 'Sign In' });
            }
            this.axios
                .post("/api/forum/comment", {
                    post_id: this.post_id,
                    content: this.incontent,
                    parent_comment_id: this.parent_comment_id,
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    }
                })
                .then((res) => {
                    ElMessage({
                        message: "留言成功",
                        type: "success",
                        duration: 3000,
                    });
                    this.incontent = ''
                    this.key++
                    if (this.type == 1 || this.type == 2)
                        this.$emit('newchildcomment', res.data.comment)
                    else if (this.type == 0)
                        this.$emit('newcomment', res.data.comment)
                }).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.status);
                        if (error.response.status == 402) {
                            ElMessage.error(error.response.data.error);
                        }
                    }
                });
        },
        save() {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$cookies.set("go_login_then_backpost", this.post_id, "3min");
                this.$router.push({ name: 'Sign In' });
            }
            this.axios
                .post("/api/forum/comment", {
                    post_id: this.post_id,
                    content: this.incontent,
                    mention: this.mention,
                    comment_id: this.comment_id,
                }, {
                    headers: {
                        'Authorization': `Bearer ` + this.token
                    }
                })
                .then((res) => {
                    ElMessage({
                        message: res.data.success,
                        type: "success",
                        duration: 3000,
                    });
                    this.$emit('updatevalue', this.incontent)
                    this.$emit('change_readOnly')

                }).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.status);
                        if (error.response.status == 402) {
                            ElMessage.error(error.response.data.error);
                        }
                    }
                });
        },
    },

    data() {
        return {
            token: this.$cookies.get("token"),
            key: 0,
            incontent: this.content ? this.content : '',
            output: [],
            placeholder: this.content ? '' : '發表留言:',
            post_id: this.$route.params.post_id,
            editorOptions: {

                modules: {

                    mention: {  // 重点： 提醒功能配置项

                        // allowedChars: /^[A-Za-z\s]*$/, // 正则匹配
                        allowedChars: /^[\u4e00-\u9fa5A-Za-z0-9\s]*$/,
                        mentionDenotationChars: ['@'], // 匹配符号，匹配到@符号弹出提醒框

                        offsetLeft: 4,

                        source: (searchTerm, renderList, mentionChar) => {

                            const values = this.all_user.map(item => ({

                                id: item.account,

                                value: item.name,

                            }))
                            if (searchTerm.length === 0) {
                                renderList(values, searchTerm);
                            } else {
                                const matches = [];
                                for (let i = 0; i < values.length; i++)
                                    if (
                                        ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
                                    )
                                        matches.push(values[i]);
                                renderList(matches, searchTerm);
                            }

                        },

                        onSelect: (data, insertItem) => { // 注意：选中后的回调函数

                            const item = {

                                text: `@${data.value}`,

                                name: data.value,

                                id: data.id,

                            }

                            insertItem(data) // 注意：这个函数必须加上，有这个才会在文本框显示选中的值

                            console.log(item)

                        },

                    },

                },

            },

        };
    },

};
</script>
<style>
.ql-container.ql-snow {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
}

.read {
    border-bottom: none !important;
}

.ql-editor {
    padding: 3px 15px !important
}

.ql-toolbar.ql-snow {
    display: none !important;
}

.ql-editor.ql-blank::before {
    font-style: inherit !important;
}

.ql-container {
    font-family: "Noto Sans TC", sans-serif !important;
    font-size: 15px !important;
}

.ql-editor p {
    cursor: default;
}

.mention {
    cursor: pointer;
}
</style>