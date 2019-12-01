import Vue from 'vue';
import App from './App.vue';
import '@/assets/css/tailwind.css';
import router from '@/router.js';
import { VueSpinners } from '@saeris/vue-spinners';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';

import { dollar, percent } from '@/filters.js';

Vue.filter('dollar', dollar);
Vue.filter('percent', percent);

Vue.use(VueSpinners);
Vue.use(Chartkick.use(Chart));
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
