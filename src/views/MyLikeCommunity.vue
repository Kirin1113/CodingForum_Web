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
                                            {{ community.name }}
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
    name: "MyLikeCommunity",
    data() {
        return {
            communitys: [],
            loading: true,
            noResult: false,
            message: "",
            more_lock: false,
            send_author_id: ''
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
        this.noResult = false
        this.loadDataFromServer()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
      },
      async loadDataFromServer() {
        if (!this.more_lock) {
          this.more_lock = true;
          if (!this.noResult) {
            this.loading = true;
            try {
              const res = await this.axios.post("/api/forum/get_like_community", {
                author_id: this.send_author_id
              }, {
                headers: {
                  'Authorization': `Bearer ${this.$cookies.get("token")}`
                }
              });
  
              if (res.data && Array.isArray(res.data.success)) {
                let newCommunitys = res.data.success.filter(item => !this.communitys.some(community => community.id === item.id));
                this.communitys = [...this.communitys, ...newCommunitys.slice(0, 8)];
                if (newCommunitys.length === 0) {
                  this.noResult = true;
                }
              } else {
                console.error("Unexpected response format:", res.data);
              }
            } catch (error) {
              console.error("Error loading data:", error);
              // Handle error state
            }
          }
          this.loading = false;
          this.more_lock = false;
        }
      }
    },
};
</script>
