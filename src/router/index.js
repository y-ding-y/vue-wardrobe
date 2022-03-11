import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import filesx from '@/components/cut/index.vue'
import download from '@/components/downloadall/index.vue'
import divdrag from '@/components/divdrag.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/files',
      name: 'filesx',
      component: filesx
    },
    {
      path: '/download',
      name: 'download',
      component: download
    },
    {
      path: '/divdrag',
      name: 'divdrag',
      component: divdrag
    }
  ]
})
