// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui' //element-ui的全部组件  
import './assets/css/theme-green/index.css'
import './assets/css/main.css'
import uploader from 'vue-simple-uploader'
import localforage from 'localforage';
import jquery from 'jquery'
import JSZip from 'jszip'

import FileSaver from 'file-saver'
import VueDND from 'awe-dnd'

Vue.use(VueDND)
Vue.config.productionTip = false
Vue.prototype.$localForage = localforage;
Vue.prototype.$ = jquery;
Vue.use(ElementUI, {
  size: 'small'
});

Vue.use(uploader)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
