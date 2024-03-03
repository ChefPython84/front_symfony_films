import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/security/Login.vue'),
      props: true
    },
    {
      path:'/MovieView',
      name: 'MovieView',
      component: () => import('../views/MovieView.vue'),
      props: true
    },
    {
      path: '/MovieDetail:id',
      name: 'MovieDetail',
      component: () => import('../views/MovieDetail.vue'),
      props: true
    }
  ]
})

export default router
