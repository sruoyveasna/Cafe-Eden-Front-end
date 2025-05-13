<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-800">Eden Cafe Dashboard</h1>
        <button
          @click="handleLogout"
          class="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
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
