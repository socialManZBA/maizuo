<template>
    <!-- <div @scroll = "onScroll" class="page-home-films"> @scroll监听滚动事件  -->
    <van-list ref="myBox"  v-model="filmLoading" finished-text="拉不出来了..." @load="getFilmList"  :finished="isFinished">
        <div class="page-home-films">
            <Banner class = "banner" :list = "bannerList"  pagination loop autoplay></Banner>
            <div class="city-fixed" @click="handleGoCity">
                <!-- curCityInfo有可能ajax请求还没有完成,dom就已经被渲染出来了,所以curCityInfo是空,.name就变成了undefied -->
                <!-- 所以用&&,前面为真才会走后面的,短路运算 -->
                <span>{{curCityInfo && curCityInfo.name}}</span> 
                <i class="iconfont icon-xiala"></i>
            </div>
            <van-tabs v-model="curFilmType" sticky>
                <van-tab title="正在热映">
                    <Filmlist filmType="nowPlaying" :list="filmLish"/>
                </van-tab>
                <van-tab title="即将上映">
                    <Filmlist filmType="comingSoon" :list="filmLish"/>
                </van-tab>
            </van-tabs>
        </div>
    </van-list>   
</template>


<script>
import Banner from "@/components/Banner/index.vue";
import Filmlist from "@/components/Filmlist/index.vue";
import { mapState, mapActions, mapGetters} from "vuex"
export default {
    name: "films",
    data () {
        return {
            // active: 0
        }
    },
    components:{
        Banner,
        Filmlist
    },
    methods: {
        ...mapActions("film",["getBannerList","getFilmList"]),
        // onScroll() {
        //     console.log(123)
        // }
        // 城市按钮的点击事件,编程式导航
        handleGoCity() {
            this.$router.push("/city");
        }
    },
    computed: {
        ...mapState("film",["bannerList","filmLish"]),
        ...mapGetters("city",["curCityInfo"]),
        curFilmType: {
            get() {
                return this.$store.state.film.curFilmType
            },
            set(value) {
                this.$store.commit({
                    type:"film/setCurFilmType",
                    filmType: value
                })
            }
        },
        // filmLoading因为绑定了v-moudle所以
         filmLoading: {
            get() {
                return this.$store.state.film.filmLoading;
            },
            set(value) {
                this.$store.commit({
                    type:"film/setFilmLoading",
                    loading: value
                })
            }
        },
        ...mapGetters("film",["isFinished"])
    },
// 监听curFilmType的变换
    watch: {
        curFilmType(newVal, oldVal) {
            // console.log(this.$refs.myBox.$el)
            this.$refs.myBox.$el.scrollTop = 0;
            //为了解决点击即将上映中数据出现数据混乱的问题,ajax请求是传递true过去
            this.getFilmList(true);
        }
    },

    // 在这个组件刚创建出来的时候就发请求v
    created() {
        this.getBannerList()
    // 由于使用了 van-list 默认它的 @load 事件会触发一次
        // this.getFilmList()
    }
}
</script>

<style lang="scss">
 .page-home-films{
     .banner{
         img{
             width: 100%;
         }
     }
     .city-fixed {
        position: absolute;
        top: 18px;
        left: 7px;
        color: #fff;
        z-index: 10;
        font-size: 13px;
        background: rgba(0, 0, 0, 0.2);
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        text-align: center;
        padding: 0 5px;

        i {
            font-size: 10px;
        }
  }
 }
</style>
