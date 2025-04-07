import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Siber from '../views/Siber.vue';
import Home from '../views/Home.vue';
import Order from '../views/Order.vue';
import Search from '../views/Search.vue';
import Passenger from '../components/commonInfo/passenger.vue';
import Person from '../components/commonInfo/person.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/siber', 
    component: Siber,
    children: [
      { path: '', component: Home },
      { path: 'order', component: Order },
      { path: 'search', component: Search },
      { path: 'passenger', component: Passenger },
      { path: 'person', component: Person }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;