<template>
  <AppLayout>
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Recipe Management</h1>
          <p class="text-sm text-gray-500">Manage how each menu item is composed from ingredients.</p>
        </div>
        <button
          @click="openAddModal"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          ➕ Add Recipe
        </button>
      </div>

      <!-- Placeholder content -->
      <div class="bg-white p-6 rounded-xl shadow text-gray-500">
        Recipe list will be displayed here.
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/Common/AppLayout.vue'

const openAddModal = () => {
  console.log('Open Add Recipe modal')
}
</script>
