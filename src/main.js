import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/";
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
