<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
              type="text"
              v-model="form.username"
              placeholder="请输入用户名"
              required
              :class="{ 'is-invalid': errors.username }"
          >
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <input
              type="email"
              v-model="form.email"
              placeholder="请输入邮箱"
              required
              :class="{ 'is-invalid': errors.email }"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              required
              :class="{ 'is-invalid': errors.password }"
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              required
              :class="{ 'is-invalid': errors.confirmPassword }"
          >
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="form.realName"
              placeholder="请输入真实姓名"
              required
              :class="{ 'is-invalid': errors.realName }"
          >
          <span v-if="errors.realName" class="error-message">{{ errors.realName }}</span>
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="form.idCard"
              placeholder="请输入身份证号"
              required
              :class="{ 'is-invalid': errors.idCard }"
          >
          <span v-if="errors.idCard" class="error-message">{{ errors.idCard }}</span>
        </div>

        <div class="form-group">
          <input
              type="text"
              v-model="form.phone"
              placeholder="请输入手机号"
              required
              :class="{ 'is-invalid': errors.phone }"
          >
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <button type="submit" class="register-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '注册中...' : '注 册' }}
        </button>
      </form>

      <p class="login-link">
        已有账号？<router-link to="/">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // 引入 axios

const router = useRouter()
const isSubmitting = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  realName: '', // 添加真实姓名字段
  idCard: '', // 添加身份证号字段
  phone: '' // 添加手机号字段
})

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  realName: '', // 添加真实姓名错误信息字段
  idCard: '', // 添加身份证号错误信息字段
  phone: '' // 添加手机号错误信息字段
})

const validateForm = () => {
  let isValid = true
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    realName: '', // 重置真实姓名错误信息
    idCard: '', // 重置身份证号错误信息
    phone: '' // 重置手机号错误信息
  }

  // 用户名验证
  if (!form.value.username) {
    errors.value.username = '用户名不能为空'
    isValid = false
  } else if (form.value.username.length < 4) {
    errors.value.username = '用户名至少4个字符'
    isValid = false
  }

  // 邮箱验证
  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 密码验证
  if (!form.value.password) {
    errors.value.password = '密码不能为空'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = '密码至少6个字符'
    isValid = false
  }

  // 确认密码验证
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // 真实姓名验证
  if (!form.value.realName) {
    errors.value.realName = '真实姓名不能为空'
    isValid = false
  }

  // 身份证号验证
  if (!form.value.idCard) {
    errors.value.idCard = '身份证号不能为空'
    isValid = false
  }

  // 手机号验证
  if (!form.value.phone) {
    errors.value.phone = '手机号不能为空'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    errors.value.phone = '请输入有效的手机号'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await axios.post('http://localhost:8080/user/register', {
      username: form.value.username,
      passwordHash: form.value.password, // 假设密码直接发送，实际应用中应加密
      realName: form.value.realName,
      idCard: form.value.idCard,
      phone: form.value.phone,
      email: form.value.email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data.data) {
      alert("注册成功");

    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('注册失败:', error)

  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  font-family: 'Arial', sans-serif;
}

.register-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

h2 {
  text-align: center;
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

input.is-invalid {
  border-color: #ff4d4f;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #ff4d4f;
  font-size: 14px;
}

.register-btn {
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

.register-btn:hover {
  background: #16213e;
}

.register-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #0f3460;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>