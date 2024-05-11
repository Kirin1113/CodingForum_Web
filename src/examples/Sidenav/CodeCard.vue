<template>
    <a :id="'a' + type"
        class="code-link relative my-2 ms-4  pl-2 block rounded border-none text-left text-blue hover:bg-blue hover:text-white sameline"
        style="" @click="Code_changepost">
        <div class="text-[.7rem] font-medium text-grey-600/50">{{ sort }} <span class="font-bold text-white">{{ comment }}
            </span>
        </div>
    </a>
</template>
<script>

export default {
    name: "CodeCard",
    props: ["type", "sort", "comment"],
    data() {
        return {
            star: [],

        };
    },
    mounted() {
        document.getElementById('a0').classList.add('bg-blue', 'text-white', 'code-links')
        document.getElementById('a6').classList.add('bg-blue', 'text-white', 'code-links')
        document.getElementById('a13').classList.add('bg-blue', 'text-white', 'code-links')

    },
    methods: {
        Code_changepost() {
            // text-white
            if (this.type <= 5) { //貼文排序
                for (let number = 0; number <= 5; number++) {
                    if (number == this.type) {
                        document.getElementById('a' + number).classList.add('bg-blue', 'text-white', 'code-links')
                    }
                    else {
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                    }
                }
            } else if (this.type >= 6 && this.type <= 12) { //星數
                if (this.type == 6) {
                    document.getElementById('a6').classList.add('bg-blue', 'text-white', 'code-links')
                    for (let number = 7; number <= 12; number++)
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                } else {
                    document.getElementById('a6').classList.remove('bg-blue', 'text-white', 'code-links')
                    document.getElementById('a' + this.type).classList.toggle('bg-blue',)
                    document.getElementById('a' + this.type).classList.toggle('text-white')
                    document.getElementById('a' + this.type).classList.toggle('code-links')

                }
            } else if (this.type >= 13 && this.type <= 17) { //星數
                if (this.type == 13) {
                    document.getElementById('a13').classList.add('bg-blue', 'text-white', 'code-links')
                    for (let number = 14; number <= 17; number++)
                        document.getElementById('a' + number).classList.remove('bg-blue', 'text-white', 'code-links')
                } else {
                    document.getElementById('a13').classList.remove('bg-blue', 'text-white', 'code-links')
                    document.getElementById('a' + this.type).classList.toggle('bg-blue',)
                    document.getElementById('a' + this.type).classList.toggle('text-white')
                    document.getElementById('a' + this.type).classList.toggle('code-links')

                }
            }

            this.$nextTick(() => {
                this.$parent.$parent.$emit('changepost', { type: this.type })
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
