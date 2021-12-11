import Editor from '@tinymce/tinymce-vue';
import Vue from 'vue';
import VueRx from 'vue-rx';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.component('tinymce-editor', Editor);

Vue.use(Vuetify, {
  iconfont: 'md'
});

Vue.use(VueRx);

Vue.filter('formatDate', (value: Date) => {
  const date = new Date(value);
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return year + '-' + month + '-' + day;
});

Vue.filter('formatTime', (value: Date) => {
  const date = new Date(value);
  let hours = date.getHours().toString();
  hours = hours.length > 1 ? hours : '0' + hours;

  let minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : '0' + minutes;

  return hours + ':' + minutes;
});

Vue.filter('formatDateTime', (value: Date) => {
  const date = new Date(value);
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  let hours = date.getHours().toString();
  hours = hours.length > 1 ? hours : '0' + hours;

  let minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : '0' + minutes;

  return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
