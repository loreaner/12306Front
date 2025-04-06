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
    <router-view class="content"></router-view>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  padding: 20px;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.sidebar {
  width: 200px; /* 固定宽度 */
  height: 100%; /* 固定高度 */
  padding: 10px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
  box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%; /* 固定高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar a.router-link-exact-active {
  font-weight: bold;
  color: #007bff;
  background-color: #e0e0e0;
}

.content {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  overflow-y: auto; /* 添加垂直滚动条 */
}
</style>
