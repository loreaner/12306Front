<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 调整 userInfo 对象的字段，使其与后端返回的字段一致
const userInfo = ref({
  username: '',
  realName: '', // 对应后端的 realName
  country: '中国',
  idType: '身份证',
  idNumber: '', // 对应后端的 idCard
  verified: false, // 对应后端的 isVerified
  phone: '',
  email: ''
})

// 身份证号码脱敏处理
const maskIdNumber = (idNumber) => {
  if (!idNumber) return ''
  return idNumber.replace(/(\d{3})\d{6}(\d{4})/, '$1********$2')
}

// 手机号码脱敏处理
const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 从后端获取用户信息
const loadData = async () => {
  try {
    const username = localStorage.getItem('userName') // 假设登录时存储了用户名
    const response = await axios.get('http://localhost:8080/user/info', { // 修改 URL，添加 http:// 协议
      params: { username }
    })
    console.log(response.data.data) // 打印后端返回的数据

    // 映射后端返回的字段到 userInfo 对象
    userInfo.value = {
      username: response.data.data.username,
      realName: response.data.data.realName || '', // 使用 || 防止字段为空
      country: '中国',
      idType: '身份证',
      idNumber: response.data.data.idCard || '',
      verified: response.data.data.isVerified === 1, // 将数字 1 转换为布尔值
      phone: response.data.data.phone || '',
      email: response.data.data.email || ''
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="person-info">
    <h3>基本信息</h3>
    <el-row :gutter="20">
      <el-col :span="8">
        <p><strong>用户名:</strong> {{ userInfo.username }}</p>
      </el-col>
      <el-col :span="8">
        <p><strong>姓名:</strong> {{ userInfo.realName }}</p> <!-- 更新字段名为 realName -->
      </el-col>
      <el-col :span="8">
        <p><strong>国家/地区:</strong> {{ userInfo.country }}</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <p><strong>证件类型:</strong> {{ userInfo.idType }}</p>
      </el-col>
      <el-col :span="8">
        <p><strong>证件号码:</strong> {{ maskIdNumber(userInfo.idNumber) }}</p> <!-- 更新字段名为 idNumber -->
      </el-col>
      <el-col :span="8">
        <p><strong>核验状态:</strong> {{ userInfo.verified ? '通过' : '未通过' }}</p>
      </el-col>
    </el-row>

    <h3>联系方式</h3>
    <el-row :gutter="20">
      <el-col :span="8">
        <p><strong>手机号:</strong> {{ maskPhone(userInfo.phone) }}</p> <!-- 更新字段名为 phone -->
      </el-col>
      <el-col :span="8">
        <p><strong>邮箱:</strong> {{ userInfo.email }}</p> <!-- 更新字段名为 email -->
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.person-info {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 20px;
  color: #409EFF;
}

.el-row {
  margin-bottom: 15px;
}

p {
  margin: 0;
  line-height: 1.6;
}
</style>