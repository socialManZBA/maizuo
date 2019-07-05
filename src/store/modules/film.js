import axios from "axios";
import { Toast } from "vant";
import { stat } from "fs";

const state = {
  bannerList: [],
  filmLish: [],
  total: 1, //总条数
  curFilmType: 0, // 当前影片的类型
  filmLoading: false, // 影片加载状态
  pageNum: 1, //页码
  pageSize: 10 // 每页显示条数
};

const getters = {
  // 的到总页数
  totalPage(state) {
    return Math.ceil(state.total / state.pageSize);
  },

  // 是否还有更多数据, 为true代表没有更多
  isFinished(state, getters) {
    return state.pageNum > getters.totalPage;
  }
};

const mutations = {
  // 改变banner图list
  setBannerList(state, payload) {
    state.bannerList = payload.list;
  },
  // 改变电影信息
  setFilmList(state, payload) {
    state.filmLish = payload.list;
    state.total = payload.total;
  },
  // 修改请求的type类型
  setCurFilmType(state, payload) {
    state.curFilmType = payload.filmType;
  },
  // 因为引用list的上下拉,要改变filmLoading的布尔值
  setFilmLoading(state, payload) {
    state.filmLoading = payload.loading;
  },
  // 改变pageNum的值
  setPageNum(state, payload) {
    state.pageNum = payload.num;
  }
};

const actions = {
  // 获取banner图list
  getBannerList({ commit }) {
    axios
      .get("https://m.maizuo.com/gateway?type=2&cityId=440300&k=2342909", {
        headers: {
          "X-Client-Info":
            ' {"a":"3000","ch":"1002","v":"5.0.4","e":"15611746489234179686472"}',
          "X-Host": "mall.cfg.common-banner"
        }
      })
      .then(function(response) {
        let res = response.data;
        // console.log(res);
        if (res.status === 0) {
          commit({
            type: "setBannerList",
            list: res.data
          });
        } else {
          alert("网络延迟");
        }
      });
  },

  // 获取电影信息
  getFilmList({ commit, state, rootState }, isChangeFilmType) {
    //接收isChangeFilmType, 判断isChangeFilmType
    //为了解决点击即将上映中数据出现数据混乱的问题,ajax请求是传递true过去
    if (isChangeFilmType) {
      // 清空filmLish列表
      // commit({
      //     type: "setFilmList",   //这里直接清空setFilmList又会出现bug,因为切换之前setFilmList已经清空,van-list
      // 默认觉得是在最底部,所以又重新执行load事件,加上监听就两次了,请求同样数据就报key值相等的错误
      //     list: [],
      //     total: 1
      // }),
      // 将pageNum变成1
      commit({
        type: "setPageNum",
        num: 1
      });
    }
    // 请求之前,loading...
    Toast.loading({
      duration: 0,
      mask: true,
      message: "加载中..."
    });
    axios
      .get("https://m.maizuo.com/gateway", {
        params: {
          // 在film这个仓库要拿到city仓库里面的数据就要用rootState
          cityId: rootState.city.curCityId,
          pageNum: state.pageNum,
          pageSize: state.pageSize,
          type: state.curFilmType === 0 ? 1 : 2,
          k: 8049573
        },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"15611746489234179686472"}',
          "X-Host": "mall.film-ticket.film.list"
        }
      })
      .then(response => {
        let res = response.data;
        console.log(res);
        if (res.status === 0) {
          commit({
            type: "setFilmList",
            // list: res.data.films,

            // list: state.filmLish.concat(res.data.films),
            // list: state.filmLish.push(...res.data.films),
            // 在这里解决key值相同的错误
            list: isChangeFilmType
              ? res.data.films
              : [...state.filmLish, ...res.data.films],
            // 这样一开始filmLish就不会为空,就不会报错,如果是监听传过来的请求就会把filmLish的值
            // 重新覆盖,如果不是就追加,并且监听那边把scrollTop变成0
            total: res.data.total
          });
        } else {
          Toast(res.meg);
        }
        // 1. 数据加载完成，需要将 filmLoading 设置为 false
        commit({
          type: "setFilmLoading",
          loading: false
        });
        // 2. 数据加载完成，需要将页码++
        commit({
          type: "setPageNum",
          num: state.pageNum + 1
        });
        // 3. 判断是否是最后一页 ，已经交给上面的 isFinised 来处理了
        // 4. 数据追击，而不是赋值。

        Toast.clear();
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
