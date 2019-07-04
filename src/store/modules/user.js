import axios from "axios";
import {Toast } from "vant"
import router from "@/router"

const state = {
    userInfo: window.localStorage.getItem("userInfo")
        ? JSON.parse(window.localStorage.getItem("userInfo"))
        : null
};

const getters = {

};

const mutations = {
    setUserInfo(state,payload) {
        state.userInfo = payload.info;
    }
};

const actions = {
    handleLogin(context, payload) {
         // 请求之前,loading...
         Toast.loading({
            duration: 0,
            mask: true,
            message: '加载中...'
        });
        // 登录
        axios.post("http://127.0.0.1:9090/sign-in",payload)
        .then(response=>{
            Toast.clear()
            let res = response.data;
            console.log(res);
            if (res.code === 0) {
                // 登录成功
                 // 本地存储
                window.localStorage.setItem("userInfo", JSON.stringify(res.data));
                Toast.success('登陆成功');
                context.commit({
                    type: "setUserInfo",
                    info: res.data
                })
                // 跳转 注意不能使用 this.$router
                router.push("/center");
                
            }else{
                // 登录失败
                Toast(res.msg)
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
}
