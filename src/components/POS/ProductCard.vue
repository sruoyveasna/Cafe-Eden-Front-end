<template>
  <div
    class="bg-white rounded-xl shadow p-3 flex flex-col hover:shadow-md transition"
  >
    <!-- Product Image -->
    <img
      :src="imageUrl"
      alt="Product Image"
      class="rounded-xl h-32 w-full object-cover mb-2"
    />

    <!-- Info -->
    <h3 class="font-semibold text-sm text-gray-800">{{ item.name }}</h3>
    <p class="text-sm text-gray-600">${{ formattedPrice }}</p>

    <!-- Ratings (Optional) -->
    <div class="text-yellow-400 text-xs mt-1 mb-2">
      ★★★★☆
    </div>

    <!-- Add Button -->
    <div class="mt-auto text-right">
      <button
        @click="$emit('add-to-cart', item)"
        class="bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const { item } = defineProps({ item: Object });

const imageUrl = computed(() => {
  return item?.image
    ? `http://localhost:8000/storage/${item.image}`
    : 'https://via.placeholder.com/150?text=No+Image';
});

const formattedPrice = computed(() => {
  const price = parseFloat(item.price);
  return isNaN(price) ? '0.00' : price.toFixed(2);
});
</script>
