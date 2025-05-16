<template>
  <AppLayout>
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Menu Items</h1>
          <p class="text-sm text-gray-500">Manage food and drink offerings.</p>
        </div>
        <button
          @click="openAddModal"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          ➕ Add Item
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th class="px-6 py-3 font-semibold">Image</th>
              <th class="px-6 py-3 font-semibold">Name</th>
              <th class="px-6 py-3 font-semibold">Price</th>
              <th class="px-6 py-3 font-semibold">Category</th>
              <th class="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="item in menuItems" :key="item.id">
              <td class="px-6 py-4">
                <img :src="`/public/${item.image}`" alt="item" class="w-10 h-10 rounded object-cover" />
              </td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-4">${{ item.price }}</td>
              <td class="px-6 py-4">{{ item.category?.name }}</td>
              <td class="px-6 py-4">
                <button class="text-blue-600 hover:underline mr-2" @click="editItem(item)">Edit</button>
                <button class="text-red-600 hover:underline" @click="deleteItem(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/Common/AppLayout.vue';
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const menuItems = ref([]);

const fetchMenuItems = async () => {
  const res = await api.get('/menu-items'); // Adjust to match your actual API
  menuItems.value = res.data;
};

const openAddModal = () => {
  console.log('Open add modal');
};

const editItem = (item) => {
  console.log('Edit:', item);
};

const deleteItem = async (id) => {
  await api.delete(`/menu-items/${id}`);
  fetchMenuItems();
};

onMounted(fetchMenuItems);
</script>
