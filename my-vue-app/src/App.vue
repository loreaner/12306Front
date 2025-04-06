<script setup>

import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Order from './views/Order.vue';
import Search from './views/Search.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/order', component: Order },
    { path: '/search', component: Search }
  ]
});

</script>

<template>
  <div class="app-container">
    <nav class="sidebar">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/order">Order</router-link></li>
        <li><router-link to="/search">Search</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  padding: 20px;
}

.sidebar {
  width: 200px;
  padding: 10px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
}

.sidebar a.router-link-exact-active {
  font-weight: bold;
  color: #007bff;
}

</style>
