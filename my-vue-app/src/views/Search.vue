<script setup>
import { ref, computed } from 'vue';

const orders = ref([
  { id: 1, product: 'Product 1', quantity: 2, price: 29.99 },
  { id: 2, product: 'Product 2', quantity: 1, price: 49.99 },
  { id: 3, product: 'Product 3', quantity: 3, price: 19.99 }
]);

const searchQuery = ref('');

const filteredOrders = computed(() => {
  return orders.value.filter(order => 
    order.product.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="search-container">
    <h1>Search Orders</h1>
    <input v-model="searchQuery" placeholder="Search orders..." class="search-input" />
    <ul>
      <li v-for="order in filteredOrders" :key="order.id">
        {{ order.product }} - Quantity: {{ order.quantity }} - Price: ${{ order.price.toFixed(2) }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-container h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.search-container ul {
  list-style-type: none;
  padding: 0;
}

.search-container li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.search-container li:last-child {
  border-bottom: none;
}

.search-input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}
</style>