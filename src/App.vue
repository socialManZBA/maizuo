<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "APP",
  methods: {
    ...mapActions("city", ["getCities"])
  },
  created() {
    // //1.  请求城市列表数据,但是在此之前先判断本地是否有数据,因为之前可能已经存储了
    // let cities = window.localStorage.getItem("cities");
    // if (!cities) {
    //   this.getCities()
    // }
    // 2. 有或者这里继续发送请求不需要动,这这个请求函数中做判断,找到city,js中的getCities()
    this.getCities();
  }
};
</script>

<style lang="scss"></style>
