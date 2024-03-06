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
      path: '/MovieDetail/:id',
      name: 'MovieDetail',
      component: () => import('../views/MovieDetail.vue'),
      props: true
    },
    {
      path: '/ActorDetail/:id',
      name: 'ActorDetail',
      component: () => import('../views/ActorDetail.vue'),
      props: true,
    },
    {
      path:'/ActorView',
      name: 'ActorView',
      component: () => import('../views/ActorView.vue'),
      props: true
    },
    {
      path: '/CategoryDetail/:id',
      name: 'CategoryDetail',
      component: () => import('../views/CategoryDetail.vue'),
      props: true
    },
    {
      path:'/CategoryView',
      name: 'CategoryView',
      component: () => import('../views/CategoryView.vue'),
      props: true
    },
    {
      path: '/UserDetail/:id',
      name: 'UserDetail',
      component: () => import('../views/UserDetail.vue'),
      props: true
    },
    {
      path:'/UserView',
      name: 'UserView',
      component: () => import('../views/UserView.vue'),
      props: true
    },

  ]
})

export default router
