<template>
  <aside class="bg-white shadow h-full flex flex-col justify-between w-64">
    <!-- Top logo -->
    <div>
      <div class="p-6 text-2xl font-bold text-purple-700">☕ Eden POS</div>

      <!-- Management Section -->
      <div class="px-4 mb-2 text-gray-500 text-sm font-semibold">Management</div>
      <nav class="space-y-1 px-4">
        <SidebarItem to="/dashboard" label="Dashboard" icon="📊" />
        <SidebarItem to="/pos" label="POS" icon="🛒" />
        <SidebarItem to="/orders" label="Orders" icon="📦" />
        <SidebarItem to="/menu" label="Menu" icon="🍔" />
        <SidebarItem to="/inventory" label="Inventory" icon="📦" />
        <SidebarItem to="/reports" label="Analytic" icon="📈" />
      </nav>

      <!-- Personal Section -->
      <div class="px-4 mt-6 text-gray-500 text-sm font-semibold">Personal</div>
      <nav class="space-y-1 px-4">
        <SidebarItem to="#" label="Messages" icon="💬" badge="99+" />
        <SidebarItem to="#" label="Notifications" icon="🔔" badge="9" />
        <SidebarItem to="#" label="Setting" icon="⚙️" />
      </nav>
    </div>

    <!-- Profile Footer -->
    <div class="p-4 border-t">
      <div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/100?img=3" class="w-10 h-10 rounded-full" />
        <div>
          <p class="text-sm font-semibold">POMO store 2</p>
          <p class="text-xs text-gray-500">pomostore201@eu.co</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue';
</script>
