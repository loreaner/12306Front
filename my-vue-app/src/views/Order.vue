<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tickets = ref([]);
const loading = ref(true);

onMounted(async () => {
  await fetchTickets();
});

const fetchTickets = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8083/order/list');
    tickets.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
  } finally {
    loading.value = false;
  }
};

const deleteTicket = async (id) => {
  try {
    await axios.delete(`http://localhost:8083/ticket/delete/${id}`);
    await fetchTickets();
  } catch (error) {
    console.error('Failed to delete ticket:', error);
  }
};

const cancelOrder = async (id) => {
  // 添加取消订单逻辑
  console.log('Cancel order:', id);
};

const goPayment = async (id) => {
  // 添加去支付逻辑
  console.log('Go to payment:', id);
};
</script>

<template>
  <div class="order-list">
    <h1>车票管理</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="未完成订单" name="unfinished"></el-tab-pane>
      <el-tab-pane label="未出行订单" name="untraveled"></el-tab-pane>
      <el-tab-pane label="历史订单" name="history"></el-tab-pane>
    </el-tabs>
    <el-table :data="tickets" v-loading="loading">
      <el-table-column prop="trainNo" label="车次信息">
        <template #default="scope">
          <div>
            订票日期：{{ scope.row.date }}<br>
            {{ scope.row.departureStation }} --> {{ scope.row.arrivalStation }} {{ scope.row.trainNo }}<br>
            {{ scope.row.departureTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="旅客信息">
        <template #default="scope">
          {{ scope.row.name }} {{ scope.row.idType }}
        </template>
      </el-table-column>
      <el-table-column prop="seatType" label="席位信息">
        <template #default="scope">
          {{ scope.row.seatType }}<br>
          {{ scope.row.carriage }}{{ scope.row.seatNo }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="票价">
        <template #default="scope">
          成人票<br>
          ¥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="车票状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" @click="cancelOrder(scope.row.id)">取消订单</el-button>
          <el-button type="primary" @click="goPayment(scope.row.id)">去支付</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.order-list {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.order-list h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* 修改按钮样式 */
.el-button {
  width: 80%; /* 减小按钮宽度 */
  height: 30px; /* 减小按钮高度 */
  padding: 5px 10px; /* 调整内边距 */
  font-size: 14px; /* 统一字体大小 */
  margin-top: 5px; /* 统一按钮间距 */
}
</style>