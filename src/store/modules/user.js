import axios from "axios";
import { Toast } from "vant";
import router from "@/router";

const state = {
  userInfo: window.localStorage.getItem("userInfo")
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null
};

const getters = {};

const mutations = {
  setUserInfo(state, payload) {
    state.userInfo = payload.info;
  },

  // 修改图片内容
  setUserAvatar(state,payload) {
    let newUserInfo = {...state.userInfo,avatar:payload.avatar} //将之前的userInfo展开,用新请求回来的数据覆盖之前的,在合并
    state.userInfo = newUserInfo;
    window.localStorage.setItem("userInfo",JSON.stringify(newUserInfo));//将userInfo再次存入localStorage
  }
};

const actions = {
  // 登录
  handleLogin(context, payload) {
    // 请求之前,loading...
    Toast.loading({
      duration: 0,
      mask: true,
      message: "加载中..."
    });
    // 登录
    axios.post("http://127.0.0.1:9090/sign-in", payload).then(response => {
      Toast.clear();
      let res = response.data;
      console.log(res);
      if (res.code === 0) {
        // 登录成功
        // 本地存储
        window.localStorage.setItem("userInfo", JSON.stringify(res.data));
        Toast.success("登陆成功");
        context.commit({
          type: "setUserInfo",
          info: res.data
        });
        // 跳转 注意不能使用 this.$router,要先引用router
        // 跳转前看看有没有redirect这个参数
        let redirect = router.currentRoute.query.redirect || "/center";
        router.replace(redirect);
        // router.push("/center");
      } else {
        // 登录失败
        Toast(res.msg);
      }
    });
  },

    // 头像更换
    handleUpdAvatar({commit,state},event) {
      // console.log("图片更换");
      // console.log(event.target.files[0]);  // 这里输出的是图片的信息对象,有大小什么的这些,要路径没用,我们存的就是这图片的信息对象
      // 请求之前,loading...
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      // 因为请求的是图片不是平常的数据,所以要用formData 查看https://elvmx.gitee.io/lv-wiki/node/#%E5%89%8D%E7%AB%AF%E5%AE%9E%E7%8E%B0
      let fromData = new FormData();
      fromData.append("userId",state.userInfo.userId);
      fromData.append("avatar",event.target.files[0]);
      axios.post("http://localhost:9090/user/profile",fromData,{
        headers: {
          "content-type": "multipart/form-data" // 将默认规定在发送表单数据之前如何对其进行编码。
        }
      })
      .then(response =>{
        Toast.clear();
        let res = response.data;
        if (res.code === 0) {
          Toast.success("修改成功");
          console.log(res)
          commit({
            type: "setUserAvatar",
            avatar: res.data
          })
        }else{
          Toast(res.msg);
        }
      })
    }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
