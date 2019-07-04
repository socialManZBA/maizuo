<template>
    <div ref="banner" class="mz-banner swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in list" :key="item.bannerId">
                <img :src="item.imgUrl" alt="">.
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        
        <!-- 如果需要导航按钮 -->
        <template v-if="navigation">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </template>
        
        <!-- 如果需要滚动条 -->
        <div class="swiper-scrollbar" v-if="scrollbar"></div>
    </div>
</template>

<script>
import Swiper from "swiper"; // 这相当于引入了swiper的js代码
export default {
    name: "Banner",
    props: {
        // 是否自动轮播
        autoplay:{
            type: Boolean,
            default: false
        },
//      是否需要导航前进后退按钮
        navigation: {
            type: Boolean,
            default: false
        },
        // 是否需要滚动条
        scrollbar: {
            type: Boolean,
            default: false
        },
        // 是否需要分页器
         pagination: {
            type: Boolean,
            default: false
        },
        // 是否需要循环
         loop: {
            type: Boolean,
            default: false
        },

        // 轮播项目
        list:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    
    // 监听有无初始化mySwiper
    watch: {
        list(newVal,oldVal) {
            if (this.mySwiper) {
                this.mySwiper.destroy();
            }
            this.$nextTick(()=>{
                this.initSwiper();
            })
        }
    },

    methods:{
        initSwiper() {
            let container = this.$refs.banner;
             this.mySwiper = new Swiper (container, {
                // 如果需要自动轮播
                autoplay: this.autoplay ? true : false,
                //  如果需要循环
                loop: this.loop ? true: false,
                  // 如果需要前进后退按钮
                navigation: this.navigation ? {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                } : {},
                   // 如果需要分页器按钮
                pagination: this.pagination
                    ? {
                        el: ".swiper-pagination"
                    }
                : {},
                // 如果需要滚动条
                scrollbar: this.scrollbar ? {
                     el: '.swiper-scrollbar',
                } : {},
             })
        }
    },
    mounted () {
        this.initSwiper();
    }
}
</script>

<style lang="scss">
@import "~swiper/dist/css/swiper.css";  // 引入swiper的 css 文件,前面加 ~ ,个人理解为node_modules
@import "~@/assets/style/common/px2rem.scss";
.mz-banner {
    height: px2rem(210);
}
</style>
