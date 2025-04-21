import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Siber from '../views/Siber.vue';
import Home from '../views/Home.vue';
import Ticket from '../components/ticket/Ticket.vue'; // 确认路径正确
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
      { path: 'ticket', component: Ticket },
      { path: 'passenger', component: Passenger },
      { path: 'person', component: Person },
      { path: 'buy-ticket', component: () => import('../components/ticket/buyTicket.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;