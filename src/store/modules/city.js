import axios from "axios";
import { Toast } from "vant";
import { CLIENT_RENEG_LIMIT } from "tls";

const state = {
  // 城市列表数据
  cities: window.localStorage.getItem("cities")
    ? JSON.parse(window.localStorage.getItem("cities"))
    : [],
  // 搜索关键字
  searchVal: "",
  //   当前的城市id,但是先判断本地存储是否存在
  curCityId: window.localStorage.getItem("cityId")
    ? window.localStorage.getItem("cityId") - 0
    : 440300
};

const getters = {
  // 将请求回来的数据整理成我们想要的数组对象{数组}类型,是对state数据进行二次运算,所以放getter里面
  cityList(state) {
    let result = [];
    state.cities.forEach(city => {
      let py = city.pinyin.charAt(0).toUpperCase();
      let index = result.findIndex(item => item.py === py);
      if (index > -1) {
        result[index].list.push(city);
      } else {
        let obj = {
          py,
          list: [city]
        };
        result.push(obj);
      }
    });
    // 整理将数据按升序排列
    result = result.sort((a, b) => {
      return a.py.charCodeAt() - b.py.charCodeAt();
    });
    return result;
  },

  //  热门城市筛选,也是对state里面数据进行二次处理,所以放getter里面
  hotCity(state) {
    return state.cities.filter(city => {
      return city.isHot === 1;
    });
  },

  // 右边的ABCDEF...,要一个只有py的数组,用map
  indexlist(state, getters) {
    //这函数里面不传state会出错,日了狗
    return getters.cityList.map(item => {
      return item.py;
    });
  },

  // 返回查询是的结果,因为是根据state中的cities和searchVal得出 结果,所以写在getters里面
  searchList(state) {
    let tmp = [];
    if (state.searchVal.length > 0) {
      tmp = state.cities.filter(item => {
        return item.name.indexOf(state.searchVal) > -1; //如果不判断,默认匹配空字符串会全部返回,所以要加if判断
      });
    }
    return tmp;
  },

  // 当前选择的城市的信息
  curCityInfo(state) {
    return state.cities.find(item => {
      return item.cityId === state.curCityId;
    });
  }
};

const mutations = {
  // 改变input的value值
  setSearchVal(state, payload) {
    state.searchVal = payload.value;
  },
  setCities(state, payload) {
    state.cities = payload.list;
  },
  // 修改城市的id
  setCurCityId(state, payload) {
    state.curCityId = payload.cityId;
  }
};

const actions = {
  getCities({ commit, state }) {
    // 判断this.cities中是否有值
    if (state.cities.length) {
      return;
    }
    Toast.loading({ duration: 0, mask: true, message: "加载中..." });
    axios
      .get("https://m.maizuo.com/gateway?k=2455074", {
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"15611746489234179686472"}',
          "X-Host": "mall.film-ticket.city.list"
        }
      })
      .then(response => {
        let res = response.data;
        if (res.status === 0) {
          // 1. 将城市数据给到 仓库
          commit({ type: "setCities", list: res.data.cities });
          //  2 将城市的信息存储到本地,因为中国的城市很难变化,方便下次使用不用发送ajax请求
          window.localStorage.setItem(
            "cities",
            JSON.stringify(res.data.cities)
          );
        } else {
          Toast(res.msg);
        }
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
