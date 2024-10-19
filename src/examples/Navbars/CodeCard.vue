<template>
    <a :id="'a' + type"
        class="code-link relative my-2 ms-4  pl-2 block rounded border-none text-left text-blue hover:bg-blue hover:text-white sameline"
        style="" @click="Code_changepost">
        <div class="text-[.7rem] font-medium text-grey-600/50">{{ sort }}
        </div>
    </a>
</template>

<script>
export default {
    name: "CodeCard",
    props: ["type", "sort"],
    data() {
        return {
            star: [],
        };
    },
    // mounted() {
    //     document.getElementById('a0').classList.add('bg-blue', 'text-white', 'code-links')
    //     document.getElementById('a6').classList.add('bg-blue', 'text-white', 'code-links')
    //     document.getElementById('a13').classList.add('bg-blue', 'text-white', 'code-links')
    // },
    methods: {
        Code_changepost() {
            // text-white
            if (this.type <= 7) { //影片排序
                for (let number = 0; number <= 7; number++) {
                    if (number == this.type) {
                        document.getElementById('a' + number).classList.add('bg-blue', 'text-white', 'code-links')
                    }
                    else {
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                    }
                }
            } else if (this.type >= 8 && this.type <= 14) { //星數
                if (this.type == 8) {
                    document.getElementById('a8').classList.add('bg-blue', 'text-white', 'code-links')
                    for (let number = 9; number <= 14; number++)
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                } else {
                    document.getElementById('a8').classList.remove('bg-blue', 'text-white', 'code-links')
                    document.getElementById('a' + this.type).classList.toggle('bg-blue',)
                    document.getElementById('a' + this.type).classList.toggle('text-white')
                    document.getElementById('a' + this.type).classList.toggle('code-links')

                }
            } else if (this.type >= 15 && this.type <= 19) { //程式語言
                if (this.type == 15) {
                    document.getElementById('a15').classList.add('bg-blue', 'text-white', 'code-links')
                    for (let number = 16; number <= 19; number++)
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                } else {
                    document.getElementById('a15').classList.remove('bg-blue', 'text-white', 'code-links')
                    document.getElementById('a' + this.type).classList.toggle('bg-blue',)
                    document.getElementById('a' + this.type).classList.toggle('text-white')
                    document.getElementById('a' + this.type).classList.toggle('code-links')
                }
            }else if(this.type >= 20 && this.type <= 23) {
                for (let number = 20; number <= 23; number++) {
                    if (number == this.type) {
                        document.getElementById('a' + number).classList.add('bg-blue', 'text-white', 'code-links')
                    }
                    else {
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                    }
                }
            }
            this.$nextTick(() => {
                this.$parent.$emit('changepost', { type: this.type })
            });
        }
    }
};
</script>

<style>
.sameline {
    display: inline-block !important;
}
</style>
<style scoped>
a {
    cursor: pointer;
}

a:hover {
    color: #328af1;
}
</style>
