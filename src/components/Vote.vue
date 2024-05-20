<template>
    <div class="vote">
        <div class="vote__down-vote" @click.prevent="downvote" :class="[{ voted: disliked == true }]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#8A939A" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <div class="vote__count" :class="[
            { positive: num > 0 },
            { negative: num < 0 },
        ]">
            <transition-slide>
                <div v-if="isVisible" class="box">
                    <span class="vote__count-n"> <i class="fa-solid fa-heart"></i> x {{ num }} </span>
                </div>
            </transition-slide>
        </div>
        <div class="vote__up-vote" @click.prevent="upvote" :class="[{ voted: liked == true }]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="#8A939A" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
    </div>
</template>
  
<script>
import { ElMessage } from "element-plus";
import { TransitionSlide } from '@morev/vue-transitions';

export default {
    components: { TransitionSlide },
    unmounted() {
        clearTimeout(this.timer);
    },
    props: {
        count: {
            type: Number,
            default: 0,
        },
        post_id: {
            type: Number,
            default: 0,
        },
        isLiked: {
            type: Boolean,
        },
        isDisliked: {
            type: Boolean,
        },
        loading: {
            type: Number,
        },
        like_function: {
            type: Function
        },
        type: {
            type: Number,//0post //1comment
        },
    },
    data() {
        return {
            num: this.count,
            liked: this.isLiked,
            disliked: this.isDisliked,
            token: this.$cookies.get("token"),
            limit: false,
            isVisible: true,
        };
    },
    created() {
        this.$watch(
            () => ({
                loading: this.loading,
            }),
            () => {
                if (this.$route.name != 'Video') {
                    return;
                }
                if (this.type == 0) {
                    if (this.loading <= 1)
                        this.num = this.count;
                } else if (this.type == 1) {
                    if (this.loading < 1)
                        this.num = this.count;
                }
                this.liked = this.isLiked;
                this.disliked = this.isDisliked;
            },
            { deep: true, immediate: true }
        );
    },
    methods: {
        timelimit() {
            this.limit = false;
        },
        check() {
            if (!this.token) {
                ElMessage.error("請先登入以進行操作");
                this.$cookies.set("go_login_then_backpost", this.$route.params.post_id, "10min");
                this.$router.push({ name: 'Sign In' });
            }
            if (this.limit) {
                ElMessage({
                    message: '操作過於頻繁，請稍等',
                    grouping: true,
                    type: 'error',
                })
            }
        },
        downvote() {
            this.check();
            if (this.disliked != true && !this.limit) {
                this.num--
                this.$emit('like_function', -1);
                this.limit = true;
                this.change(0);
                setTimeout(this.timelimit, 1000);
            }
        },
        upvote() {
            this.check();
            if (this.liked != true && !this.limit) {
                this.num++
                this.$emit('like_function', 1);
                this.limit = true;
                this.change(0);
                setTimeout(this.timelimit, 1000);
            }
        },
        changetofalse() {
            this.isVisible = false;
            setTimeout(this.change, 50, 1);
        },
        change(level) {
            if (level != 1)
                this.changetofalse();
            else
                this.isVisible = true
        }
    },
};
</script>
  
<style >
.vote {
    display: flex;
    align-items: center;
}

.vote svg path {
    stroke: #595959;
}

.vote__count {
    margin: 0px 5px;
    min-width: 30px;
    height: 24px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    display: flex;
    align-items: center;
    user-select: none;
    justify-content: center;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.vote__count .vote__count-n {
    transition: all 0.4s ease;
}

.vote__count.up .vote__count-n {
    transform: translateY(100%);
}

.vote__count.down .vote__count-n {
    transform: translateY(-100%);
}

.vote__count.negative {
    color: #d34f57;
}

.vote__count.positive {
    color: #2ea83a;
}

.vote__down-vote {
    border-radius: 50%;
}

.vote__down-vote.voted {
    background: rgba(211, 79, 87, 0.1);
}

.vote__down-vote.voted svg path {
    stroke: #d34f57;
}

.vote__down-vote.voted:hover {
    background: rgba(211, 79, 87, 0.2);
}

.vote__down-vote:hover {
    background: rgba(0, 0, 0, 0.05);
}

.vote__up-vote {
    border-radius: 50%;
}

.vote__up-vote.voted {
    background: rgba(79, 167, 87, 0.1);
}

.vote__up-vote.voted svg path {
    stroke: #2ea83a;
}

.vote__up-vote.voted:hover {
    background-color: rgba(79, 167, 87, 0.2);
}

.vote__up-vote:hover:hover {
    background: rgba(0, 0, 0, 0.05);
}
</style>