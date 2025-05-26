import { createRouter, createWebHistory } from 'vue-router';
import Signup from '@/views/SignUp.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/LogIn.vue';
import AddItem from '@/views/AddMissingItem.vue';
import LostItemList from '@/views/LostItemlist.vue';
import FoundItemList from '@/views/Founditemlist.vue';
import UserItemUploaded from '@/views/UserItemUploaded.vue';
import UserDeleteAndClaimed from '@/views/UserDeleteAndClaimed.vue';
import MyProfile from '@/views/MyProfile.vue';

const routes = [
  { path: '/', redirect: '/signup' },
  { path: '/signup', component: Signup },
  { path: '/dashboard', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/add-item', component: AddItem },
  { path: '/lost', component: LostItemList },
  { path: '/found', component: FoundItemList },
  { path: '/UserItemUploaded', component: UserItemUploaded },
  { path: '/UserDeleteAndClaimed', component: UserDeleteAndClaimed },
  { path: '/MyProfile', component: MyProfile },

  {
    path: '/UserDeleteAndClaimed/:id',
    name: 'UserDeleteClaimed',
    component: UserDeleteAndClaimed
  },
  {
    path: '/lost-item/:id',
    name: 'LostItemDetail',
    component: () => import('@/views/LostItemDetail.vue')
  }
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
