<template>
  <div class="passenger-info">
    <div class="action-bar">
      <el-input
          v-model="searchName"
          placeholder="请输入乘客姓名"
          style="width: 200px; margin-right: 10px"
          clearable
      />
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="primary" @click="showAddDialog = true">+ 添加</el-button>
      <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-table
        :data="filteredPassengers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
    >
      <el-table-column type="selection" width="55" />
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
        <el-button type="primary" @click="submitPassenger">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  passengers: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-passenger', 'edit-passenger', 'delete-passenger'])

const searchName = ref('')
const selectedPassengers = ref([])
const showAddDialog = ref(false)
const isEditing = ref(false)
const currentPassengerId = ref(null)

const passengerForm = ref({
  name: '',
  idType: '身份证',
  idNumber: '',
  phone: ''
})

// 过滤乘车人列表
const filteredPassengers = computed(() => {
  if (!searchName.value) return props.passengers
  return props.passengers.filter(p =>
      p.name.includes(searchName.value)
  )
})

const handleSearch = () => {
  // 搜索逻辑已在computed中实现
}

const handleSelectionChange = (selection) => {
  selectedPassengers.value = selection.map(p => p.id)
}

const handleBatchDelete = async () => {
  if (selectedPassengers.value.length === 0) {
    ElMessage.warning('请选择要删除的乘车人')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除选中的乘车人吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    emit('delete-passenger', selectedPassengers.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.log('取消删除')
  }
}

const handleAdd = () => {
  isEditing.value = false
  passengerForm.value = {
    name: '',
    idType: '身份证',
    idNumber: '',
    phone: ''
  }
  showAddDialog.value = true
}

const handleEdit = (passenger) => {
  isEditing.value = true
  currentPassengerId.value = passenger.id
  passengerForm.value = {
    name: passenger.name,
    idType: passenger.idType,
    idNumber: passenger.idNumber,
    phone: passenger.phone
  }
  showAddDialog.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该乘车人吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    emit('delete-passenger', [id])
    ElMessage.success('删除成功')
  } catch (error) {
    console.log('取消删除')
  }
}

const submitPassenger = () => {
  // 表单验证
  if (!passengerForm.value.name || !passengerForm.value.idType ||
      !passengerForm.value.idNumber || !passengerForm.value.phone) {
    ElMessage.error('请填写所有必填项')
    return
  }

  if (isEditing.value) {
    emit('edit-passenger', currentPassengerId.value, passengerForm.value)
  } else {
    emit('add-passenger', passengerForm.value)
  }

  showAddDialog.value = false
}
</script>

<style scoped>
.passenger-info {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.el-table {
  margin-top: 20px;
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button--danger {
  background-color: #F56C6C;
  border-color: #F56C6C;
}
</style>
