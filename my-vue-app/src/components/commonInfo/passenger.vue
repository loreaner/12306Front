<template>
  <div class="passenger-info">
    <!-- 新增筛选表单 -->
    <el-form :model="filterForm" inline>
      <el-form-item label="姓名">
        <el-input v-model="filterForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-select v-model="filterForm.idType" placeholder="请选择证件类型">
          <el-option label="身份证" value="身份证" />
          <el-option label="护照" value="护照" />
          <el-option label="港澳通行证" value="港澳通行证" />
          <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">筛选</el-button>
      </el-form-item>
    </el-form>

    <div class="action-bar">
      <el-button type="primary" @click="handleAddClick">+ 添加</el-button>
      <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <!-- 添加加载状态 -->
    <el-skeleton v-if="loading" :rows="5" animated />
    <el-table v-else :data="passengers" style="width: 100%" stripe>
      <el-table-column prop="id" label="序号" width="80" />
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

    <!-- 添加/编辑乘车人对话框 -->
    <el-dialog
        v-model="showAddDialog"
        :title="isEditing ? '编辑乘车人' : '添加乘车人'"
        width="50%"
    >
      <el-form :model="passengerForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="passengerForm.name" />
        </el-form-item>

        <el-form-item label="证件类型" required>
          <el-select v-model="passengerForm.idType">
            <el-option label="身份证" value="身份证" />
            <el-option label="护照" value="护照" />
            <el-option label="港澳通行证" value="港澳通行证" />
            <el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证" />
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码" required>
          <el-input v-model="passengerForm.idNumber" />
        </el-form-item>

        <el-form-item label="手机号" required>
          <el-input v-model="passengerForm.phone" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="isEditing ? editPassenger() : addPassenger()">确定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const passengers = ref([]);
const showAddDialog = ref(false);
const isEditing = ref(false);
const passengerForm = ref({});
const filterForm = ref({
  name: '',
  idType: ''
});
// 新增加载状态
const loading = ref(false);

// 获取乘客信息，支持筛选条件
const fetchPassengers = async () => {
  loading.value = true; // 开始加载
  try {
    const username = localStorage.getItem("userName");
    if (!username) {
      console.error('Username not found in localStorage');
      return;
    }

    const response = await axios.get('http://localhost:8080/passenger/search', {
      params: {
        name: username,
        ...filterForm.value // 将筛选条件附加到请求参数中
      }
    });

    if (response.data && response.data.code === 200) {
      passengers.value = response.data.data;
    } else {
      console.error('Failed to fetch passengers:', response.data.msg);
    }
  } catch (error) {
    console.error('Failed to fetch passengers:', error);
  } finally {
    loading.value = false; // 结束加载
  }
};

// 新增筛选逻辑
const handleFilter = () => {
  fetchPassengers(); // 调用获取乘客信息方法，应用筛选条件
};

onMounted(() => {
  fetchPassengers();
});

// 处理添加按钮点击事件
const handleAddClick = () => {
  showAddDialog.value = true;
  isEditing.value = false;
  passengerForm.value = {};
};

// 处理编辑按钮点击事件
const handleEdit = (passenger) => {
  passengerForm.value = { ...passenger }; // 使用传入的 passenger 对象
  showAddDialog.value = true;
  isEditing.value = true;
};

// 添加乘客
const addPassenger = async () => {
  try {
    const response = await axios.post('http://localhost:8080/passenger/add', passengerForm.value);
    if (response.data > 0) {
      showAddDialog.value = false;
      alert('乘客信息添加成功');
      fetchPassengers();
    }
  } catch (error) {
    console.error('Failed to add passenger:', error);
  }
};

// 编辑乘客
const editPassenger = async () => {
  try {
    const response = await axios.put(`http://localhost:8080/passenger/${passengerForm.value.id}`, passengerForm.value);
    if (response.data > 0) {
      showAddDialog.value = false;
      alert('乘客信息编辑成功');
      fetchPassengers();
    }
  } catch (error) {
    console.error('Failed to edit passenger:', error);
  }
};

// 删除乘客
const handleDelete = (id) => {
  axios.delete(`http://localhost:8080/passenger/${id}`).then(() => {
    fetchPassengers(); // 删除后刷新列表
  }).catch(error => {
    console.error('Failed to delete passenger:', error);
  });
};

// 批量删除乘客
const handleBatchDelete = () => {
  const selectedIds = passengers.value.filter(p => p.selected).map(p => p.id); // 获取选中的乘客 ID
  if (selectedIds.length === 0) {
    alert('请至少选择一个乘客进行删除');
    return;
  }

  axios.delete(`http://localhost:8080/passenger/batchDelete`, {
    data: { ids: selectedIds } // 批量删除接口
  }).then(() => {
    fetchPassengers(); // 删除后刷新列表
  }).catch(error => {
    console.error('Failed to batch delete passengers:', error);
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