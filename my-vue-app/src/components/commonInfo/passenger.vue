<template>
  <div class="passenger-info">
    <!-- 添加加载状态 -->
    <el-skeleton v-if="loading" :rows="5" animated />
    <el-button type="primary" @click="handleAddClick" style="margin-bottom: 20px;">添加乘客</el-button>
    <el-table v-if="!loading" :data="passengers" style="width: 100%" stripe>
      <!-- 修改：使用 type="index" 显示行序号 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="idType" label="证件类型" width="150" />
      <el-table-column prop="idNumber" label="证件号码" width="200" />
      <el-table-column prop="phone" label="手机电话" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加乘客对话框 -->
    <el-dialog
        v-model="showAddDialog"
        title="添加乘车人"
        width="50%"
    >
      <el-form :model="addPassengerForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="addPassengerForm.name" />
        </el-form-item>
        <el-form-item label="证件类型" required>
          <el-select v-model="addPassengerForm.idType">
            <el-option label="身份证" value="身份证" />
            <el-option label="护照" value="护照" />
            <el-option label="港澳通行证" value="港澳通行证" />
            <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" required>
          <el-input v-model="addPassengerForm.idNumber" />
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="addPassengerForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addPassenger">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑乘客对话框 -->
    <el-dialog
        v-model="showEditDialog"
        title="编辑乘车人"
        width="50%"
    >
      <el-form :model="editPassengerForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="editPassengerForm.name" />
        </el-form-item>
        <el-form-item label="证件类型" required>
          <el-select v-model="editPassengerForm.idType">
            <el-option label="身份证" value="身份证" />
            <el-option label="护照" value="护照" />
            <el-option label="港澳通行证" value="港澳通行证" />
            <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" required>
          <el-input v-model="editPassengerForm.idNumber" />
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="editPassengerForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="editPassenger">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 从 localStorage 获取 userName
const userName = localStorage.getItem('userName');

const passengers = ref([]);
const loading = ref(true);

// 添加乘客表单
const showAddDialog = ref(false);
const addPassengerForm = ref({
  name: '',
  idType: '身份证',
  idNumber: '',
  phone: '',
  // 确保 userName 字段正确初始化
  userName: userName // 从 localStorage 获取的 userName
});

// 编辑乘客表单
const showEditDialog = ref(false);
const editPassengerForm = ref({
  id: null,
  name: '',
  idType: '身份证',
  idNumber: '',
  phone: '',
  // 确保 userName 字段正确初始化
  userName: userName // 从 localStorage 获取的 userName
});

// 获取乘客信息
const fetchPassengers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/passenger/search', {
      params: { name: userName }
    });
    if (response.data.code === 200) {
      passengers.value = response.data.data;
    } else {
      alert('获取乘客信息失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('Failed to fetch passengers:', error);
    alert('获取乘客信息失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPassengers();
});

// 处理添加按钮点击事件
const handleAddClick = () => {
  showAddDialog.value = true;
  // 初始化添加乘客表单数据
  addPassengerForm.value = {
    name: '',
    idType: '身份证',
    idNumber: '',
    phone: '',
    userName: userName // 从 localStorage 获取的 userName
  };
};

// 处理编辑按钮点击事件
const handleEdit = (passenger) => {
  showEditDialog.value = true;
  // 确保 id 以字符串形式传递并初始化编辑乘客表单数据
  editPassengerForm.value = { 
    ...passenger, 
    id: passenger.id.toString(), 
    userName: userName // 从 localStorage 获取的 userName
  };
};

// 添加乘客
const addPassenger = async () => {
  try {
    // 在发送请求时包含 userName 字段
    const response = await axios.post('http://localhost:8080/passenger/add', addPassengerForm.value);
    if (response.data.code === 200) {
      showAddDialog.value = false;
      ElMessage.success('乘客信息添加成功');
      fetchPassengers();
    } else {
      ElMessage.error('乘客信息添加失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('Failed to add passenger:', error);
    ElMessage.error('乘客信息添加失败: ' + error.message);
  }
};

// 编辑乘客
const editPassenger = async () => {
  try {
    // 在发送请求时包含 userName 字段
    const response = await axios.post('http://localhost:8080/passenger/update', editPassengerForm.value);
    if (response.data.code === 200) {
      showEditDialog.value = false;
      ElMessage.success('乘客信息编辑成功');
      fetchPassengers();
    } else {
      ElMessage.error('乘客信息编辑失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('Failed to edit passenger:', error);
    ElMessage.error('乘客信息编辑失败: ' + error.message);
  }
};

// 删除乘客
const handleDelete = (id) => {
  // 确保 id 以字符串形式传递
  axios.post('http://localhost:8080/passenger/delete', [id.toString()]).then(response => {
    if (response.data.code === 200) {
      fetchPassengers();
      ElMessage.success('乘客信息删除成功');
    } else {
      ElMessage.error('乘客信息删除失败: ' + response.data.message);
    }
  }).catch(error => {
    console.error('Failed to delete passenger:', error);
    ElMessage.error('乘客信息删除失败: ' + error.message);
  });
};

</script>

<style scoped>
.passenger-container {
  padding: 20px;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
