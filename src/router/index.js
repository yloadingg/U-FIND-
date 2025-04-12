import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue' // ← import your Dashboard
import Login from '@/views/LogIn.vue'
import Signup from '@/views/SignUp.vue'


const routes = [
  { path: '/', redirect: '/Dashboard' }, // ← now redirect root to dashboard
  { path: '/Dashboard', component: Dashboard }, // ← add this route
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
