<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute 和 useRouter

const route = useRoute(); // 获取路由信息
const router = useRouter(); // 获取路由实例

const selectedPassenger = ref(null);
const passengers = ref([]);
const userName = ref('');
const loading = ref(true); // 添加加载状态

// 从路由参数中获取列车信息
const trainInfo = ref({
  date: '2025-04-22',
  trainNo: route.query.trainNo || 'G35',
  departureStation: route.query.startStation || '北京南站',
  arrivalStation: route.query.endStation || '杭州东站',
  departureTime: route.query.departureTime || '09:56',
  arrivalTime: route.query.arrivalTime || '04:30',
  seats: (() => {
    try {
      return route.query.seats ? JSON.parse(route.query.seats) : [
        { type: '商务座', price: '¥2313', status: '有票' },
        { type: '一等座', price: '¥1077', status: '有票' },
        { type: '二等座', price: '¥674', status: '有票' }
      ];
    } catch (error) {
      console.error('Failed to parse seats:', error);
      return [
        { type: '商务座', price: '¥2313', status: '有票' },
        { type: '一等座', price: '¥1077', status: '有票' },
        { type: '二等座', price: '¥674', status: '有票' }
      ];
    }
  })()
});

// 获取用户名并调用后端接口
onMounted(async () => {
  // 从 localStorage 获取用户名
  userName.value = localStorage.getItem('userName') || '未登录用户';
  
  await fetchPassengers(userName.value); // 调用新的方法获取乘客信息
});

// 新的获取乘客信息方法
const fetchPassengers = async (name) => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8080/passenger/search', {
      params: { name }
    });

    // 验证 response.data.data 是否为数组且每个元素都有 name 属性
    if (Array.isArray(response.data.data)) {
      passengers.value = response.data.data.filter(passenger => passenger && passenger.name);
    } else {
      passengers.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch passengers:', error);
    passengers.value = []; // 如果请求失败，清空 passengers
  } finally {
    loading.value = false;
  }
};

const selectedPassengers = ref([]); // 用于存储已选择的乘客

// 删除乘客的方法
const handleDeletePassenger = (index) => {
  selectedPassengers.value.splice(index, 1);
};

// 提交订单方法
const submitOrder = async () => {
  try {
    // 检查是否有选中的乘客
    if (selectedPassengers.value.length === 0) {
      alert('请至少选择一位乘客');
      return;
    }

    // 构建订单数据
    const orderData = selectedPassengers.value.map((passenger) => ({
      trainNo: trainInfo.value.trainNo,
      date: trainInfo.value.date,
      departureStation: trainInfo.value.departureStation,
      arrivalStation: trainInfo.value.arrivalStation,
      departureTime: trainInfo.value.departureTime,
      arrivalTime: trainInfo.value.arrivalTime,
      ticketType: passenger.ticketType,
      seatType: passenger.seatType,
      name: passenger.name,
      idType: passenger.idType,
      idNumber: passenger.idNumber,
    }));

    // 提交订单到后端，修改为使用代理路径
    const response = await axios.post('http://localhost:8083/order/save', orderData);  // 修改: http://localhost:8083/order -> /api/order

    // 处理后端响应
    if (response.data && response.data.code === 200) {
      alert('订单提交成功');
      router.push('/order-success'); // 跳转到订单成功页面
    } else {
      alert('订单提交失败：' + response.data.msg);
    }
  } catch (error) {
    console.error('Failed to submit order:', error);
    alert('订单提交失败，请稍后重试');
  }
};
</script>

<template>
  <div class="ticket-container">
    <el-card class="box-card blue-border">
      <template #header>
        <div class="card-header">
          <span>乘客信息（填写说明）</span>
        </div>
      </template>
      <!-- 用户名显示 -->
      <div>
        <span>当前用户: {{ userName }}</span>
      </div>

      <!-- 列车信息展示 -->
      <div>
        <h3>列车信息</h3>
        <p>{{ trainInfo.date }} {{ trainInfo.trainNo }}次 {{ trainInfo.departureStation }}（{{ trainInfo.departureTime }}开）——{{ trainInfo.arrivalStation }}（{{ trainInfo.arrivalTime }}到）</p>
        <ul>
          <li v-for="seat in trainInfo.seats" :key="seat.type">
            {{ seat.type }}（{{ seat.price }}） {{ seat.status }}
          </li>
        </ul>
      </div>

      <!-- 乘车人选择 -->
      <div>
        <span>乘车人</span>
        <!-- 添加加载状态 -->
        <el-skeleton v-if="loading" :rows="5" animated />
        <el-checkbox-group v-else v-model="selectedPassengers">
          <el-checkbox
            v-for="(passenger, index) in passengers"
            :key="index"
            :value="passenger"
          >
            {{ passenger?.name }} <!-- 使用可选链操作符防止访问 undefined 的属性 -->
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <!-- 乘客信息表单 -->
      <div v-if="selectedPassengers.length > 0">
        <el-table :data="selectedPassengers" style="width: 100%">
          <el-table-column prop="ticketType" label="票种" width="180">
            <template #default="scope">
              <el-select v-model="scope.row.ticketType">
                <el-option label="成人票" value="成人票"></el-option>
                <el-option label="儿童票" value="儿童票"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="seatType" label="席别" width="180">
            <template #default="scope">
              <el-select v-model="scope.row.seatType">
                <el-option label="硬座" value="硬座"></el-option>
                <el-option label="软座" value="软座"></el-option>
                <el-option label="商务座" value="商务座"></el-option>
                <el-option label="一等座" value="一等座"></el-option>
                <el-option label="二等座" value="二等座"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="idType" label="证件类型">
            <template #default="scope">
              <el-select v-model="scope.row.idType">
                <el-option label="中国居民身份证" value="中国居民身份证"></el-option>
                <el-option label="护照" value="passport"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="idNumber" label="证件号码">
            <template #default="scope">
              <el-input v-model="scope.row.idNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="danger" icon="el-icon-delete" @click="handleDeletePassenger(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div style="margin-top: 20px;">
        <el-button type="primary" class="custom-btn" @click="$router.go(-1)">上一步</el-button>
        <el-button type="primary" class="custom-btn" @click="submitOrder">提交订单</el-button>
      </div>
    </el-card>
    <p class="terms-link">
      提交订单表示已阅读并同意 <a href="#">《国铁集团铁路旅客运输规程》《服务条款》</a>
    </p>
  </div>
</template>

<style scoped>
/* 新增样式 */
.el-row {
  margin-bottom: 20px;
}

.el-col {
  display: flex;
  align-items: center;
}

.ticket-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
}

/* 蓝色边框 */
.blue-border {
  border: 2px solid #409EFF;
}

/* 自定义按钮样式 */
.custom-btn {
  margin-right: 10px;
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.custom-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 服务条款链接样式 */
.terms-link {
  margin-top: 20px;
  text-align: center;
}

.terms-link a {
  color: #409EFF;
  text-decoration: none;
}

.terms-link a:hover {
  text-decoration: underline;
}
</style>