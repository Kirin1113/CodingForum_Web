<template>
    <div class="py-4 container-fluid">
      <infinite-scroll @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <div class="card-body">
                        <div class="container-fluid p-0" v-if="communitys">
                            <div v-for="community in communitys" :key="community.id">
                                <router-link :to="{ name: 'Community', params: { community_id: community.id } }">
                                    <div class="mt-4 overflow-hidden card card-body blur shadow-blur user_cover" :style="{
                                        backgroundImage:
                                            'url(' + $global_url + '/uploads/coverpic/background3.png' + ')',
                                        backgroundPositionY: '50%',
                                        backgroundSize: 'cover'
                                    }">
                                        <div class="row gx-4">
                                            <div class="col-auto my-auto">
                                                <div class="h-100">
                                                    <h5 class="mb-1" style="background-color: #ffffffcf; color: black; border-radius: 5px;">
                                                        {{ community.title }}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3" v-for="n in 8" v-show="loading">
                <div class="card mb-2" aria-hidden="true">
                    <img src="@\assets\img\loadingbak.jpg" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-8"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </infinite-scroll>
    </div>
</template>

<script>
import InfiniteScroll from "infinite-loading-vue3";

export default {
    name: "MyCommunity",
    data() {
        return {
            communitys: [],
            loading: true,
            noResult: false,
            message: "",
            more_lock: false,
            user_account: this.$cookies.get("user_account"),
        };
    },
    components: {
      InfiniteScroll
    },
    mounted() {
      this.loadDataFromServer()
    },
    methods: {
      async loadDataFromServer() {
        if (this.more_lock) return; // 如果正在加載中，則不再觸發新的請求
        this.more_lock = true;

        if (!this.noResult) {
            this.loading = true;
            await this.axios
            .post("/api/forum/get_community", { user_account: this.user_account })
            .then((res) => {
              let allsame = true;
              let newpostcount = 0;
              console.log(res.data.success);
              res.data.success.forEach((item) => {
                if (newpostcount == 8) return;
                let same = false;
                // 確保不會將重複的資料加入
                this.communitys.forEach((community) => {
                    if (community.id == item.id) {
                    same = true;
                    return;
                    }
                });
                if (!same) {
                    this.communitys.push(item);
                    newpostcount++;
                    allsame = false;
                }
              });
              if (allsame) this.noResult = true;
            })
            .catch((err) => {
                console.log(err);
            });
        }
        this.loading = false;
        this.more_lock = false; // 加載完成後解鎖
      }

    },
};
</script>
