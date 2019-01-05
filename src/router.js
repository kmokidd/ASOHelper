import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Compete from './views/Compete.vue'
import Android from './views/Android.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/compete',
      name: 'compete',
      component: Compete
    },
    {
      path: '/android',
      name: 'android',
      component: Android
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
