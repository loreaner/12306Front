<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const trains = ref([
  { id: 1, name: 'G123', from: 'Beijing', to: 'Shanghai', time: '10:00 AM' },
  { id: 2, name: 'D456', from: 'Shanghai', to: 'Guangzhou', time: '11:30 AM' },
  { id: 3, name: 'K789', from: 'Guangzhou', to: 'Shenzhen', time: '1:00 PM' },
  { id: 4, name: 'T101', from: 'Shenzhen', to: 'Chengdu', time: '2:30 PM' },
  { id: 5, name: 'Z202', from: 'Chengdu', to: 'Xi\'an', time: '4:00 PM' },
  { id: 6, name: 'C303', from: 'Xi\'an', to: 'Lanzhou', time: '5:30 PM' },
  { id: 7, name: 'T404', from: 'Lanzhou', to: 'Xinjiang', time: '7:00 PM' },
  { id: 8, name: 'Z505', from: 'Xinjiang', to: 'Urumqi', time: '8:30 PM' },
  { id: 9, name: 'C606', from: 'Urumqi', to: 'Kunming', time: '10:00 PM' },
  { id: 10, name: 'T707', from: 'Kunming', to: 'Guilin', time: '11:30 PM' },
]);

const filteredTrains = computed(() => {
  return trains.value.filter(train => 
    train.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    train.from.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    train.to.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="home">
    <h1>铁路购票系统</h1>
    <input v-model="searchQuery" type="text" placeholder="搜索车次、始发站或终点站" class="search-bar" />
    <div class="train-list">
      <div v-for="train in filteredTrains" :key="train.id" class="train-item">
        <p><strong>车次:</strong> {{ train.name }}</p>
        <p><strong>始发站:</strong> {{ train.from }}</p>
        <p><strong>终点站:</strong> {{ train.to }}</p>
        <p><strong>发车时间:</strong> {{ train.time }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
}

.train-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto; /* 添加水平滚动条 */
  white-space: nowrap; /* 防止子元素换行 */
}

.train-item {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  flex: 0 0 auto; /* 防止子元素收缩 */
}
</style>
