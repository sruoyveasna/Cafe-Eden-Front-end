<template>
  <div class="flex justify-between items-center border-b py-2">
    <div>
      <p class="text-sm font-medium">{{ item.name }}</p>
      <p class="text-xs text-gray-500">{{ item.qty }} × ${{ item.price }}</p>
    </div>
    <button @click="$emit('remove', item.id)" class="text-red-500 text-xs">Remove</button>
  </div>
</template>

<script setup>
defineProps({ item: Object });
defineEmits(['remove']);
</script>
