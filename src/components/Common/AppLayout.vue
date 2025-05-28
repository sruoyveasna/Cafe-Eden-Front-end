<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden print:block">
    <!-- Sidebar (hidden on print) -->
    <div class="print:hidden">
      <Sidebar />
    </div>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>
