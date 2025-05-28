<template>
  <aside
    :class="[
      'bg-white shadow-md h-full flex flex-col justify-between border-r border-gray-200 rounded-r-2xl overflow-hidden transition-all duration-300',
      collapsed ? 'w-20' : 'w-60'
    ]"
  >
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Logo & Collapse Toggle -->
      <div class="flex items-center justify-between p-4" :class="{ 'justify-center': collapsed }">
        <div v-if="!collapsed" class="w-full text-center text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">Eden Coffee</div>
        <button
          @click="collapsed = !collapsed"
          class="text-purple-500 hover:text-purple-600 transition rounded-full p-3.5"
          :class="{ 'ml-auto': !collapsed }"
        >
          <component :is="collapsed ? ChevronRight : ChevronLeft" class="w-5 h-5" />
        </button>
      </div>

      <!-- Management Section -->
      <div v-if="!collapsed" class="px-6 text-xs font-semibold uppercase text-gray-500 mb-1 tracking-wide">
        {{ $t('sidebar.management') }}
      </div>
      <nav class="space-y-1 px-3">
        <SidebarItem to="/dashboard" :label="$t('sidebar.dashboard')" :icon="BarChart2" :collapsed="collapsed" />
        <SidebarItem to="/pos" :label="$t('sidebar.pos')" :icon="ShoppingCart" :collapsed="collapsed" />
        <SidebarItem to="/orders" :label="$t('sidebar.orders')" :icon="FileText" :collapsed="collapsed" />

        <!-- Menu Dropdown -->
        <div>
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="w-full flex items-center"
            :class="collapsed ? 'justify-center p-3.5' : 'justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 transition'"
          >
            <span class="flex items-center gap-2">
              <Utensils class="w-4 h-4" />
              <span v-if="!collapsed">{{ $t('sidebar.menu') }}</span>
            </span>
            <ChevronDown v-if="!collapsed" :class="{ 'rotate-180': isMenuOpen }" class="w-4 h-4 transition-transform" />
          </button>
          <div v-if="isMenuOpen && !collapsed" class="ml-6 mt-1 space-y-1">
            <SidebarItem to="/menu/items" :label="$t('sidebar.menu_items')" :icon="List" small :collapsed="collapsed" />
            <SidebarItem to="/menu/categories" :label="$t('sidebar.categories')" :icon="FolderOpen" small :collapsed="collapsed" />
          </div>
        </div>

        <!-- Inventory Dropdown -->
        <div>
          <button
            @click="isInventoryOpen = !isInventoryOpen"
            class="w-full flex items-center"
            :class="collapsed ? 'justify-center p-3.5' : 'justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 transition'"
          >
            <span class="flex items-center gap-2">
              <Boxes class="w-4 h-4" />
              <span v-if="!collapsed">{{ $t('sidebar.inventory') }}</span>
            </span>
            <ChevronDown v-if="!collapsed" :class="{ 'rotate-180': isInventoryOpen }" class="w-4 h-4 transition-transform" />
          </button>
          <div v-if="isInventoryOpen && !collapsed" class="ml-6 mt-1 space-y-1">
            <SidebarItem to="/inventory/stock" :label="$t('sidebar.stock')" :icon="Box" small :collapsed="collapsed" />
            <SidebarItem to="/inventory/recipe" :label="$t('sidebar.recipe')" :icon="FlaskConical" small :collapsed="collapsed" />
            <SidebarItem to="/inventory/ingredient" :label="$t('sidebar.ingredient')" :icon="Leaf" small :collapsed="collapsed" />
          </div>
        </div>

        <SidebarItem to="/users" :label="$t('sidebar.users')" :icon="Users" :collapsed="collapsed" />
        <SidebarItem to="/analytics" :label="$t('sidebar.analytics')" :icon="LineChart" :collapsed="collapsed" />
        <SidebarItem to="/discounts" :label="$t('sidebar.discounts')" :icon="Percent" :collapsed="collapsed" />
      </nav>

      <!-- Personal Section -->
      <div v-if="!collapsed" class="px-6 mt-6 mb-1 text-xs font-semibold uppercase text-gray-500 tracking-wide">
        {{ $t('sidebar.personal') }}
      </div>
      <nav class="space-y-1 px-3">
        <SidebarItem to="/messages" :label="$t('sidebar.messages')" :icon="MessageCircle" badge="99+" :collapsed="collapsed" />
        <SidebarItem to="/notifications" :label="$t('sidebar.notifications')" :icon="Bell" badge="9" :collapsed="collapsed" />
      </nav>
    </div>

    <!-- Footer Profile & Logout -->
    <div v-if="!collapsed" class="p-4 border-t border-gray-200 bg-gray-50 relative">
      <div class="flex items-center gap-3 cursor-pointer" @click="toggleProfileMenu">
        <img
          :src="currentUser?.profile?.avatar_url || '/images/default-avatar.png'"
          @error="onAvatarError"
          class="w-10 h-10 rounded-full object-cover border border-gray-200"
          alt="User Avatar"
        />
        <div class="text-sm leading-tight">
          <p class="font-semibold text-gray-800">{{ currentUser?.name || 'Loading...' }}</p>
          <p class="text-xs text-gray-500">{{ currentUser?.email || '' }}</p>
        </div>
      </div>

      <!-- Dropdown -->
      <transition name="fade">
        <div v-if="showProfileMenu" class="absolute bottom-[110px] left-4 right-4 bg-white border rounded-lg shadow-md py-2 z-50">
          <!-- Settings -->
          <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2" @click="goToSettings">
            <Settings class="w-4 h-4" />
            <span>{{ $t('sidebar.profile_settings') }}</span>
          </button>

          <!-- Logout -->
          <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" @click="logout">
            <LogOut class="w-4 h-4" />
            <span>{{ $t('sidebar.logout') }}</span>
          </button>
        </div>
      </transition>

      <!-- Powered By -->
      <div
        v-if="!collapsed"
        class="text-center text-[11px] text-gray-500 py-3 border-t border-gray-100 flex items-center justify-center gap-2"
      >
        <span class="text-purple-500 text-[13px]">⚡</span>
        <span class="text-[11px]">
          Powered by
          <a
            href="/about"
            class="ml-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:underline"
          >
            Thesis Developer
          </a>
        </span>
      </div>

    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SidebarItem from './SidebarItem.vue'
import api from '@/plugins/axios'
import {
  ChevronLeft, ChevronRight, ChevronDown, BarChart2, ShoppingCart, FileText, Utensils,
  List, FolderOpen, Boxes, Box, FlaskConical, Leaf, Users, LineChart, MessageCircle, Bell, Percent, Settings, LogOut
} from 'lucide-vue-next'

const { t } = useI18n()
const isMenuOpen = ref(false)
const isInventoryOpen = ref(false)
const collapsed = ref(false)
const showProfileMenu = ref(false)
const route = useRoute()
const router = useRouter()
const toast = useToast()
const currentUser = ref(null)

const toggleProfileMenu = () => showProfileMenu.value = !showProfileMenu.value
const goToSettings = () => {
  showProfileMenu.value = false
  router.push('/settings')
}
const logout = async () => {
  try {
    await api.post('/logout')
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/login')
  } catch (error) {
    toast.error('Logout failed')
    console.error('❌ Logout error:', error)
  }
}
const onAvatarError = (e) => {
  e.target.src = '/images/default-avatar.png'
}
const fetchCurrentUser = async () => {
  try {
    const res = await api.get('/profile')
    currentUser.value = res.data
  } catch (error) {
    console.error('❌ Failed to fetch user info', error)
  }
}

onMounted(fetchCurrentUser)
watchEffect(() => {
  const path = route.path
  isMenuOpen.value = path.startsWith('/menu/')
  isInventoryOpen.value = path.startsWith('/inventory/')
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
