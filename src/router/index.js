import { createRouter, createWebHistory } from 'vue-router';
import Signup from '@/views/SignUp.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/LogIn.vue';
import AddItem from '@/views/AddMissingItem.vue'; // 👈
import LostItemList from '@/views/LostItemlist.vue'; // 👈
import FoundItemList from '@/views/Founditemlist.vue'; // 👈
import UserItemUploaded from '@/views/UserItemUploaded.vue';
import UserDeleteAndClaimed from '@/views/UserDeleteAndClaimed.vue';

const routes = [
  { path: '/', redirect: '/signup' },
  { path: '/signup', component: Signup },
  { path: '/dashboard', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/add-item', component: AddItem }, // 👈 Add Missing Item
  { path: '/lost', component: LostItemList }, // 👈 Lost Item List
  { path: '/found', component: FoundItemList }, // 👈 Found Item List
  { path: '/UserItemUploaded', component: UserItemUploaded},
  { path: '/UserDeleteAndClaimed', component: UserDeleteAndClaimed},
  {
    path: '/UserDeleteAndClaimed/:id',
    name: 'UserDeleteClaimed',
    component: UserDeleteAndClaimed
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
