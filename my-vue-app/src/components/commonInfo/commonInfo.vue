<template>
  <div class="common-info-container">
    <div class="header">
      <h2>常用信息管理</h2>
    </div>

    <div class="content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="personal">
          <PersonalInfo :user-info="userInfo" @update-info="handleUpdateInfo" />
        </el-tab-pane>
        <el-tab-pane label="乘车人信息" name="passenger">
          <PassengerInfo
              :passengers="passengers"
              @add-passenger="handleAddPassenger"
              @edit-passenger="handleEditPassenger"
              @delete-passenger="handleDeletePassenger"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PersonalInfo from './PersonalInfo.vue'
import PassengerInfo from './PassengerInfo.vue'
import { getUserInfo, getPassengers } from '@/api/user'

const activeTab = ref('personal')

// 用户信息数据
const userInfo = ref({
  username: '',
  name: '',
  country: '中国',
  idType: '身份证',
  idNumber: '',
  verified: false,
  phone: '',
  email: '',
  address: ''
})

// 乘车人列表
const passengers = ref([])

// 加载数据
const loadData = async () => {
  try {
    // 获取个人信息
    const userRes = await getUserInfo()
    userInfo.value = {
      ...userRes.data,
      idNumber: maskIdNumber(userRes.data.idNumber),
      phone: maskPhone(userRes.data.phone)
    }

    // 获取乘车人列表
    const passengerRes = await getPassengers()
    passengers.value = passengerRes.data.map(p => ({
      ...p,
      idNumber: maskIdNumber(p.idNumber),
      phone: maskPhone(p.phone)
    }))
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 信息脱敏处理
const maskIdNumber = (idNumber) => {
  if (!idNumber) return ''
  return idNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1​**​​**​​**​​**​$2')
}

const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1​**​​**​$2')
}

// 处理个人信息更新
const handleUpdateInfo = async (updatedInfo) => {
  try {
    // 调用API更新
    await updateUserInfo(updatedInfo)
    // 重新加载数据
    await loadData()
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    ElMessage.error('更新失败: ' + error.message)
  }
}

// 处理乘车人操作
const handleAddPassenger = async (passenger) => {
  // 实现添加逻辑
}

const handleEditPassenger = async (id, passenger) => {
  // 实现编辑逻辑
}

const handleDeletePassenger = async (id) => {
  // 实现删除逻辑
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.common-info-container {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
</style>