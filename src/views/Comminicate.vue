<template>
    <div class="py-4 container-fluid">
      <infinite-scroll @infinite-scroll="loadDataFromServer" :message="message" :noResult="noResult">
        <div class="row">
            <div class="col-12">
                <div class="card z-index-0">
                    <div class="card-body">
                        <!-- 關鍵字輸入框 -->
                        <input 
                            type="text" 
                            class="form-control" 
                            placeholder="輸入關鍵字進行搜索" 
                            v-model="searchQuery"
                            @input="searchCommunity"
                        />
                        <!-- 顯示查詢結果 -->
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
                                            {{ community.account }}
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
    name: "Comminicate",
    data() {
        return {
            communitys: [],
            searchQuery: '', // 綁定關鍵字
            loading: true,
            noResult: false,
            message: "",
            more_lock: false,
            sort: '',
        };
    },
    components: {
      InfiniteScroll
    },
    mounted() {
      this.loadDataFromServer()
    },
    methods: {
      resetpost() {
        this.communitys = [];
        this.searchQuery = '';
        this.noResult = false
        this.loadDataFromServer()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
      },
      changepost(options) {
        console.log('type ' + options.type)
        this.sort = options.type;
        this.communitys = [];
        this.searchQuery = '';
        this.noResult = false
        this.loadDataFromServer()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
      },
      searchCommunity() {
        // 當輸入關鍵字時發送請求
        if (this.searchQuery.length > 0) {
            this.axios
            .post("/api/search-suggestions", {
                query: this.searchQuery, // 傳遞查詢關鍵字
            })
            .then((res) => {
                console.log(res.data);
                this.communitys = res.data; // 更新查詢結果
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            this.communitys = []; // 若輸入框為空則清除結果
            this.searchQuery = '';
            this.noResult = false
            this.loadDataFromServer()
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
      },
      async loadDataFromServer() {
        if (!this.more_lock) {
            this.more_lock = true;
            if (!this.noResult) {
                this.loading = true;
                await this.axios
                  .post("/api/forum/get_community", {
                    sort: this.sort,
                  })
                  .then((res) => {
                    let allsame = true;
                    let newpostcount = 0;
                    console.log(res.data.success)
                    res.data.success.forEach((item) => {
                        if (newpostcount == 8) return;
                        let same = false;
                        this.communitys.forEach((community) => {
                            if (community.id == item.id) {
                                same = true;
                                return;
                            };
                        });
                        if (same == false) {
                            this.communitys.push(item);
                            newpostcount++;
                            allsame = false;
                        }
                    });
                    if (allsame)
                        this.noResult = true
                  })
            }
            this.loading = false;
            this.more_lock = false;
        }
      }
    },
};
</script>
