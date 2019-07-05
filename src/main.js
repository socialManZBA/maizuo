import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./assets/style/base.scss";
import { Tab, Tabs, Toast, List, Search } from "vant";

Vue.use(Tab)
  .use(Tabs)
  .use(Toast)
  .use(List)
  .use(Toast)
  .use(Search);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
