<template>
    <div class="page-home">
        <router-view></router-view>
        <Tabbar
            :tabs="[
            { name: '电影', icon: 'icon-dianying', to: '/films' },
            { name: '影院', icon: 'icon-yingyuana', to: '/cinemas' },
            { name: '我的', icon: 'icon-wodedangxuan', to: '/center' },
            ]"
        />
    </div>
</template>

<script>
import Tabbar from "@/components/Tabbar/index.vue"
export default {
    name: "home",
    beforeDestroy() {
        console.log("被销毁");
        
    },
    components: {
        Tabbar
    }
}
</script>

<style lang="scss">
    .page-home {
        height: 100%;
        display: flex;
        flex-direction: column;
        > div:first-child {
            flex: 1;
            overflow-y: auto;
        }
    }
</style>
