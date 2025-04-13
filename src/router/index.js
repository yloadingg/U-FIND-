import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LogIn.vue'
import Signup from '@/views/SignUp.vue'

const routes = [
  { path: '/', redirect: '/login' },     // I miss you na po  
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router