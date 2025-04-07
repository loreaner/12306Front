<script setup>
import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';  // 引入 Login 组件
import Register from './views/Register.vue';  // 引入 Register 组件

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Login },  // 将默认路由设置为 Login
    { path: '/register', component: Register }
  ]
});
</script>

<template>
  <div class="app-container">
    <router-view class="content"></router-view>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  padding: 20px;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.content {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  overflow-y: auto; /* 添加垂直滚动条 */
}
</style>
