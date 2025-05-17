<template>
  <div class="bg-white p-4 rounded-xl shadow text-center space-y-2">
    <div class="text-2xl">{{ icon }}</div>
    <div class="text-sm text-gray-500">{{ title }}</div>
    <div class="text-lg font-bold text-purple-700">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String
})
</script>
