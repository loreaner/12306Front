<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const trainData = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:8081/ticket/selectAll'); // 假设这是你的后端API地址
    trainData.value = response.data.data; // 修改为从 response.data.data 获取数据
  } catch (error) {
    console.error('Failed to fetch train data:', error);
  }
};

onMounted(() => {
  fetchData(); // 组件挂载时自动获取数据
});

// 日期选择
const selectedDate = ref('04-14');

// 车次类型筛选
const selectedTrainType = ref('');

// 出发车站和到达车站筛选
const selectedDepartureStation = ref('');
const selectedArrivalStation = ref('');

// 车次席别筛选
const selectedSeatType = ref('');

// 发送选择到后端
const sendSelection = async (type, value) => {
  try {
    await axios.post('http://localhost:8081/ticket/selectAll', { type, value });
  } catch (error) {
    console.error('Failed to send selection:', error);
  }
};

// 筛选逻辑（示例）
const filterTickets = () => {
  // 筛选逻辑（示例）
  console.log('Filtering tickets...');
};

const navigateToBuyTicket = (row) => {
  router.push({
    path: '/siber/buy-ticket', // 确保路径正确
    query: {
      trainNo: row.trainNo,
      startStation: row.startStation,
      endStation: row.endStation,
      // 添加其他需要传递的信息
    }
  });
};
</script>

<template>
  <div>
    <!-- 日期选择 -->
    <div>
      <span v-for="date in ['04-14', '04-15', '04-16', '04-17', '04-18', '04-19', '04-20', '04-21', '04-22', '04-23', '04-24', '04-25', '04-26', '04-27', '04-28']" :key="date">
        <button @click="selectedDate = date">{{ date }}</button>
      </span>
    </div>

    <!-- 车次类型筛选 -->
    <div>
      <label><input type="radio" v-model="selectedTrainType" value="gc" @change="sendSelection('trainType', 'gc')"> GC-高铁城际</label>
      <label><input type="radio" v-model="selectedTrainType" value="d" @change="sendSelection('trainType', 'd')"> D-动车</label>
      <label><input type="radio" v-model="selectedTrainType" value="复兴号" @change="sendSelection('trainType', '复兴号')"> 复兴号</label>
    </div>

    <!-- 出发车站和到达车站筛选 -->
    <div>
      <label><input type="radio" v-model="selectedDepartureStation" value="北京南" @change="sendSelection('departureStation', '北京南')"> 北京南</label>
      <label><input type="radio" v-model="selectedDepartureStation" value="北京" @change="sendSelection('departureStation', '北京')"> 北京</label>
    </div>
    <div>
      <label><input type="radio" v-model="selectedArrivalStation" value="杭州东" @change="sendSelection('arrivalStation', '杭州东')"> 杭州东</label>
      <label><input type="radio" v-model="selectedArrivalStation" value="杭州" @change="sendSelection('arrivalStation', '杭州')"> 杭州</label>
    </div>

    <!-- 车次席别筛选 -->
    <div>
      <label><input type="radio" v-model="selectedSeatType" value="商务座" @change="sendSelection('seatType', '商务座')"> 商务座</label>
      <label><input type="radio" v-model="selectedSeatType" value="一等座" @change="sendSelection('seatType', '一等座')"> 一等座</label>
      <label><input type="radio" v-model="selectedSeatType" value="二等座" @change="sendSelection('seatType', '二等座')"> 二等座</label>
      <label><input type="radio" v-model="selectedSeatType" value="二等包座" @change="sendSelection('seatType', '二等包座')"> 二等包座</label>
      <label><input type="radio" v-model="selectedSeatType" value="一等卧" @change="sendSelection('seatType', '一等卧')"> 一等卧</label>
      <label><input type="radio" v-model="selectedSeatType" value="二等卧" @change="sendSelection('seatType', '二等卧')"> 二等卧</label>
      <label><input type="radio" v-model="selectedSeatType" value="软卧" @change="sendSelection('seatType', '软卧')"> 软卧</label>
      <label><input type="radio" v-model="selectedSeatType" value="硬卧" @change="sendSelection('seatType', '硬卧')"> 硬卧</label>
      <label><input type="radio" v-model="selectedSeatType" value="硬座" @change="sendSelection('seatType', '硬座')"> 硬座</label>
      <label><input type="radio" v-model="selectedSeatType" value="无座" @change="sendSelection('seatType', '无座')"> 无座</label>
    </div>

    <!-- 筛选按钮 -->
    <button @click="filterTickets">筛选</button>

    <!-- 表格展示车次信息 -->
    <el-table :data="trainData" style="width: 100%" v-if="trainData">
      <el-table-column prop="trainNo" label="车次"></el-table-column>
      <el-table-column prop="trainType" label="车次类型"></el-table-column>
      <el-table-column prop="startStation" label="出发站"></el-table-column>
      <el-table-column prop="endStation" label="到达站"></el-table-column>
      <el-table-column prop="departureTime" label="出发时间"></el-table-column>
      <el-table-column prop="arrivalTime" label="到达时间"></el-table-column>
      <el-table-column prop="duration" label="历时"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          {{ row.status === 1 ? '可用' : '不可用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="navigateToBuyTicket(row)">预定</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
/* 添加样式 */
</style>