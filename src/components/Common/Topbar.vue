<!-- src/components/Common/Topbar.vue -->
<template>
  <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
    <button @click="handleLogout" class="text-red-500 hover:underline text-sm">
      Logout
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const router = useRouter();

const handleLogout = async () => {
  await api.post('/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
  router.push('/login');
};
</script>
