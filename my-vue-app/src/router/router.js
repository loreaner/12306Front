import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Order from '../views/Order.vue';
import Search from '../views/Search.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/order', component: Order },
  { path: '/search', component: Search }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;