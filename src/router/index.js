import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/LogIn.vue';
import Signup from '@/views/SignUp.vue';
import Dashboard from '@/views/Dashboard.vue';
import AddItem from '@/views/AddMissingItem.vue';
import LostItemList from '@/views/LostItemlist.vue';
import FoundItemList from '@/views/Founditemlist.vue';
import UserItemUploaded from '@/views/UserItemUploaded.vue';
import UserDeleteAndClaimed from '@/views/UserDeleteAndClaimed.vue';
import MyProfile from '@/views/MyProfile.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/add-item', component: AddItem, meta: { requiresAuth: true } },
  { path: '/lost', component: LostItemList, meta: { requiresAuth: true } },
  { path: '/found', component: FoundItemList, meta: { requiresAuth: true } },
  { path: '/UserItemUploaded', component: UserItemUploaded, meta: { requiresAuth: true } },
  { path: '/UserDeleteAndClaimed', component: UserDeleteAndClaimed, meta: { requiresAuth: true } },
  { path: '/MyProfile', component: MyProfile, meta: { requiresAuth: true } },
  {
    path: '/UserDeleteAndClaimed/:id',
    name: 'UserDeleteClaimed',
    component: UserDeleteAndClaimed,
    meta: { requiresAuth: true }
  },
  {
    path: '/lost-item/:id',
    name: 'LostItemDetail',
    component: () => import('@/views/LostItemDetail.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
