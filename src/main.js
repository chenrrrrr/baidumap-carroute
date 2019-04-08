import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BaiduMap from "vue-baidu-map";

Vue.config.productionTip = false;

Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: "YOUR_APP_KEY"
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
