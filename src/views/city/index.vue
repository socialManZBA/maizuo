<template>
  <div class="page-city">
    <!-- 搜索框 -->
    <van-search
      v-model="searchVal"
      placeholder="请输入搜索关键词"
      background="#f4f4f4"
      show-action
    />
    <!-- 城市内容 -->
    <div class="lv-indexlist" v-show="!searchVal">
      <ul class="lv-indexlist__content" ref="lv-indexlist__content">
        <div class="recommend-city">
          <div class="gprs-city">
            <div class="city-index-title">GPS定位你所在城市</div>
            <ul class="city-index-detail">
              <li class="city-item-detail city-item-detail-gprs">
                <div class="city-item-text">定位失败</div>
              </li>
            </ul>
          </div>
          <div class="hot-city">
            <div class="city-index-title">热门城市</div>
            <ul class="city-index-detail">
              <li
                class="city-item-detail"
                v-for="item in hotCity"
                :key="item.cityId"
                @click="handleChgCity(item)"
              >
                <div class="city-item-text">{{ item.name }}</div>
              </li>
              <!-- <li class="city-item-detail">
                                <div class="city-item-text">天津</div>
                            </li> -->
            </ul>
          </div>
        </div>
        <li
          :ref="'box_' + item.py"
          class="lv-indexsection"
          v-for="item in cityList"
          :key="item.py"
        >
          <p class="lv-indexsection__index">{{ item.py }}</p>
          <ul>
            <li
              v-for="city in item.list"
              :key="city.cityId"
              @click="handleChgCity(city)"
            >
              {{ city.name }}
            </li>
          </ul>
        </li>
      </ul>
      <div class="lv-indexlist__nav">
        <ul>
          <li v-for="item in indexlist" :key="item" @click="goTop(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 搜索内容 -->
    <div class="lv-indexlist" v-show="searchVal">
      <!-- 当有城市信息的时候显示,与下是互斥 -->
      <ul class="search_box" v-show="searchList.length">
        <li
          v-for="item in searchList"
          :key="item.cityId"
          @click="handleChgCity(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <!-- 当没有城市数据的时候显示没有的信息,与上市互斥关系 -->
      <div class="empty-result" v-show="!searchList.length">
        <img src="../../assets/images/img.png" alt="" />
        <p>没有找到匹配的城市</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "city",
  data() {
    return {
      //   searchVal: ""
    };
  },
  methods: {
    // ...mapActions("city", ["getCities"]),  // 城市列表不在这里请求了,因为很多地方都用到,在别的地方用回出现数据为空,所以一开始就要去加载城市的数据
    goTop(py) {
      // 1. 找到左侧对应着的dom元素
      let el = this.$refs["box_" + py][0]; //因为返回的是一个数组,所以要下标的方式才知道是谁
      // 2. 得到当前 el 距离顶部的距离
      let offsetTop = el.offsetTop;
      // 3. 操作左侧的滚动条的 scrollTop 属性
      let box = this.$refs["lv-indexlist__content"]; //不像上面那样还要取下标[0],因为不是在循环里
      box.scrollTop = offsetTop;
    },

    // 选中城市'
    handleChgCity(city) {
      let cityId = city.cityId;
      this.$store.commit({
        type: "city/setCurCityId",
        cityId
      });
      // 跳转到主页,编程式导航
      this.$router.back();
      // 将点击的城市id存储在本地
      window.localStorage.setItem("cityId", cityId);
    }
  },
  computed: {
    ...mapGetters("city", ["cityList", "hotCity", "indexlist", "searchList"]),
    searchVal: {
      get() {
        return this.$store.state.city.searchVal;
      },
      set(value) {
        this.$store.commit({
          type: "city/setSearchVal",
          value
        });
      }
    }
  },
  created() {
    // 城市列表不在这里请求了,因为很多地方都用到,在别的地方用回出现数据为空,所以万年老二一开始就要去加载城市的数据
    // this.getCities();
  }
};
</script>

<style lang="scss">
@import "~@/assets/style/common/mixins.scss";
@import "~@/assets/style/common/px2rem.scss";

.page-city {
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-search__content {
    background-color: #fff;
  }

  .lv-indexlist {
    .search_box {
      padding-left: 15px;
      width: 100%;
      li {
        @include border-bottom;
        width: 100%;
        height: px2rem(44);
        position: relative;
        line-height: px2rem(44);
        color: #191a1b;
        font-size: 13px;
      }
    }
    .empty-result {
      position: absolute;
      top: 107px;
      width: 100%;
      text-align: center;
      img {
        width: 90px;
        margin: auto;
      }
      p {
        color: #bdc0c5;
        font-size: 14px;
        margin: 0;
      }
    }
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    background: #fff;
    overflow: hidden;
    position: relative;
    &__content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
    }
    &__nav {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 18px;
      height: 100%;

      li {
        height: 18px;
        font-size: 12px;
        color: #191a1b;
        padding: 0 6px;
      }
    }

    .lv-indexsection {
      font-size: 16px;

      &__index {
        background-color: #f4f4f4;
        color: #797d82;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 15px;
        margin-bottom: -1px;
        li {
          @include border-bottom;
          position: relative;
          width: 100%;
          height: 48px;
          line-height: 48px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    .recommend-city {
      padding-left: 15px;
      padding-top: 15px;

      .city-index-title {
        font-size: 13px;
        color: #797d82;
        margin-bottom: 10px;
      }

      .city-index-detail {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        .city-item-detail {
          width: 33.33%;
          text-align: center;
          padding-bottom: 15px;
          box-sizing: border-box;
          float: left;

          .city-item-text {
            height: 30px;
            line-height: 30px;
            background-color: #f4f4f4;
            border-radius: 3px;
            box-sizing: border-box;
            margin: 0 7.5px;
            font-size: 14px;
            color: #191a1b;
          }
        }
      }
    }
  }
}
</style>
