<script setup>
import { ref } from 'vue';

const selectedPassenger = ref(null);

const selectPassenger = (passenger) => {
  selectedPassenger.value = passenger;
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
      <!-- 乘车人选择 -->
      <div>
        <span>乘车人</span>
        <el-checkbox v-model="passenger.isSelected" v-for="(passenger, index) in passengers" :key="index" @click="selectPassenger(passenger)">
          {{ index + 1 }}. {{ passenger.name }}
        </el-checkbox>
      </div>
      <!-- 乘客信息表单 -->
      <div v-if="selectedPassenger">
        <el-form label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="序号">
                {{ selectedPassenger.index + 1 }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="票种">
                <el-select v-model="selectedPassenger.ticketType">
                  <el-option label="成人票" value="成人票"></el-option>
                  <el-option label="儿童票" value="儿童票"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="席别">
                <el-select v-model="selectedPassenger.seatType">
                  <el-option label="硬座" value="硬座"></el-option>
                  <el-option label="软座" value="软座"></el-option>
                  <el-option label="商务座" value="商务座"></el-option>
                  <el-option label="一等座" value="一等座"></el-option>
                  <el-option label="二等座" value="二等座"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名">
                <el-input v-model="selectedPassenger.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件类型">
                <el-select v-model="selectedPassenger.idType">
                  <el-option label="中国居民身份证" value="中国居民身份证"></el-option>
                  <el-option label="护照" value="passport"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件号码">
                <el-input v-model="selectedPassenger.idNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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