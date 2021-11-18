import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import store from './store/index.js'
import 'element-ui/lib/theme-chalk/index.css';

import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";

Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.postKeyValueRequest=postKeyValueRequest;


Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

router.beforeEach((to, from, next) => {
  //判断要跳转的页面是否是登录页
  if (to.path=='/'){
    next();
  }else {
    initMenu(router,store);
    next();
  }
})

