<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
              type="text"
              v-model="form.username"
              placeholder="请输入用户名"
              required
          >
        </div>
        <div class="form-group">
          <input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              required
          >
        </div>
        <button type="submit" class="login-btn">登 录</button>
      </form>
      <p class="toggle-text">
        还没有账号？<span @click="goToRegister">立即注册</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // 引入 axios

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    const params = new URLSearchParams();
    params.append('username', form.value.username);
    params.append('password', form.value.password);

    // 修改 URL 为完整的后端服务地址
    const response = await axios.post('http://localhost:8080/user/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }); // 发送登录请求

    if (response.data) {
      alert("登录成功");
      localStorage.setItem('userName', form.value.username); // 存储用户名
      await router.push('/siber'); // 跳转到 Siber.vue
    } else {
      alert("登录失败");
    }

  } catch (error) {
    console.error('登录失败:', error);
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  font-family: 'Arial', sans-serif;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s;
}

input:focus {
  border-color: #0f3460;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #0f3460;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.login-btn:hover {
  background: #16213e;
}

.toggle-text {
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.toggle-text span {
  color: #0f3460;
  cursor: pointer;
  font-weight: 600;
}

.toggle-text span:hover {
  text-decoration: underline;
}
</style>