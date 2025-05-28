<template>
  <AppLayout>
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">🍽️ {{ $t('menu.title') }}</h1>
        <button
          @click="openAddModal"
          class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-full font-semibold shadow transition-all duration-200 flex items-center gap-2"
        >
          ➕ {{ $t('menu.add') }}
        </button>
      </div>

      <!-- Summary -->
      <div class="text-sm text-gray-600">
        {{ $t('menu.total') }}: <strong>{{ menuItems.length }}</strong>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden h-[calc(100vh-220px)]">
        <div class="overflow-y-auto h-full no-scrollbar">
          <table class="min-w-full table-fixed divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-100 sticky top-0 z-10 text-left text-gray-600 border-b">
              <tr>
                <th class="px-4 py-3 font-semibold align-middle w-[100px]">{{ $t('menu.image') }}</th>
                <th class="px-4 py-3 font-semibold align-middle w-[200px]">{{ $t('menu.name') }}</th>
                <th class="px-4 py-3 font-semibold align-middle w-[100px]">{{ $t('menu.price') }}</th>
                <th class="px-4 py-3 font-semibold align-middle w-[150px]">{{ $t('menu.category') }}</th>
                <th class="px-4 py-3 font-semibold align-middle w-[180px]">{{ $t('menu.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in menuItems"
                :key="item.id"
                class="bg-white hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 align-middle">
                  <img
                    :src="`/storage/${item.image}`"
                    alt="item image"
                    class="w-12 h-12 rounded-lg object-cover border"
                  />
                </td>
                <td class="px-4 py-3 font-medium text-gray-800 align-middle">{{ item.name }}</td>
                <td class="px-4 py-3 text-gray-700 font-semibold align-middle">${{ item.price }}</td>
                <td class="px-4 py-3 align-middle">
                  <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {{ item.category?.name || '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 space-x-2 align-middle">
                  <button
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition"
                    @click="editItem(item)"
                  >
                    ✏️ {{ $t('actions.edit') }}
                  </button>
                  <button
                    class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition"
                    @click="askDelete(item)"
                  >
                    🗑️ {{ $t('actions.delete') }}
                  </button>
                </td>
              </tr>
              <tr v-if="menuItems.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400 align-middle">
                  {{ $t('menu.empty') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddMenuItemModal :show="showAddModal" @close="closeAddModal" @saved="handleSaved" />
    <EditMenuItemModal :show="showEditModal" :item="selectedItem" @close="closeEditModal" @saved="handleSaved" />
    <Toast ref="toastRef" />
    <ConfirmModal
      :show="showConfirm"
      :message="$t('menu.confirmDelete', { name: selectedItem?.name })"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/Common/AppLayout.vue'
import AddMenuItemModal from '@/components/Menu/AddMenuItemModal.vue'
import EditMenuItemModal from '@/components/Menu/EditMenuItemModal.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'
import Toast from '@/components/Common/Toast.vue'
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const menuItems = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const showConfirm = ref(false)
const selectedItem = ref(null)
const toastRef = ref(null)

const fetchMenuItems = async () => {
  const res = await api.get('/menu-items')
  menuItems.value = res.data
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const editItem = (item) => {
  selectedItem.value = item
  showEditModal.value = true
}

const closeEditModal = () => {
  selectedItem.value = null
  showEditModal.value = false
}

const askDelete = (item) => {
  selectedItem.value = item
  showConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await api.delete(`/menu-items/${selectedItem.value.id}`)
    toastRef.value?.showToast(`🗑️ ${selectedItem.value.name} deleted successfully!`)
    fetchMenuItems()
  } catch (error) {
    toastRef.value?.showToast('❌ Failed to delete item.')
  } finally {
    showConfirm.value = false
    selectedItem.value = null
  }
}

const cancelDelete = () => {
  showConfirm.value = false
  selectedItem.value = null
}

const handleSaved = () => {
  fetchMenuItems()
  toastRef.value?.showToast('✅ Item saved successfully!')
}

onMounted(fetchMenuItems)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
