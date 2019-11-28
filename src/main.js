import Vue from 'vue';
import App from './App.vue';
import '@/assets/css/tailwind.css';
import router from '@/router.js';

import { dollar, percent } from '@/filters.js';

Vue.filter('dollar', dollar);
Vue.filter('percent', percent);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
