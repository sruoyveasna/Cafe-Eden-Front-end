<template>
  <AppLayout>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
          📦 Stock Management
        </h1>
        <button @click="openAddForm"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm shadow transition">
          ➕ Add Stock
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage"
        class="bg-green-100 text-green-800 border border-green-300 rounded p-3 flex justify-between items-center max-w-xl">
        <span>{{ successMessage }}</span>
        <button @click="successMessage = ''" class="font-bold">✖</button>
      </div>

      <!-- Table -->
      <div class="rounded-xl shadow border border-gray-100 overflow-hidden">
        <div class="max-h-[500px] overflow-y-auto custom-scroll">
          <table class="min-w-full text-sm bg-white">
            <thead class="bg-purple-50 text-purple-800 text-left font-semibold sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">#</th>
                <th class="px-4 py-3">Ingredient</th>
                <th class="px-4 py-3">Quantity</th>
                <th class="px-4 py-3">Last Updated</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stock, index) in stocks" :key="stock.id" class="border-t hover:bg-gray-50 transition">
                <td class="px-4 py-3 align-middle">{{ index + 1 }}</td>
                <td class="px-4 py-3 font-medium align-middle">{{ stock.ingredient.name }}</td>
                <td class="px-4 py-3 align-middle">{{ stock.quantity }} {{ stock.ingredient.unit }}</td>
                <td class="px-4 py-3 align-middle">{{ formatDate(stock.updated_at) }}</td>
                <td class="px-4 py-3 text-center align-middle">
                  <button class="px-4 py-1 text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 text-xs"
                    @click="editStock(stock)">
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <teleport to="body">
        <div v-if="openModal" class="fixed inset-0 z-[999] flex items-center justify-center">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-50 z-[998]"></div>

          <!-- Modal Box -->
          <div class="relative z-[999] bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
            <h2 class="text-lg font-bold text-gray-800">
              {{ isEditing ? '🖊️ Update Stock' : '➕ Add Stock' }}
            </h2>

            <!-- Form -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Ingredient</label>
                <input v-if="isEditing" v-model="selectedIngredientName" disabled
                  class="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
                <select v-else v-model="form.ingredient_id"
                  class="w-full border rounded px-3 py-2 focus:ring focus:border-purple-500">
                  <option disabled value="">-- Select Ingredient --</option>
                  <option v-for="ingredient in availableIngredients" :key="ingredient.id" :value="ingredient.id">
                    {{ ingredient.name }} ({{ ingredient.unit }})
                  </option>
                </select>
              </div>

              <div v-if="isEditing">
                <label class="block text-sm font-medium mb-1">Current Quantity</label>
                <input v-model="form.current_quantity" disabled
                  class="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Add Quantity</label>
                <input type="number" v-model="form.addQuantity" class="w-full border rounded px-3 py-2"
                  placeholder="Enter quantity to add" />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end pt-4 space-x-2">
              <button @click="closeModal"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition">
                Cancel
              </button>
              <button @click="updateStock"
                class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/Common/AppLayout.vue';
import { ref, computed, onMounted } from 'vue';
import api from '@/plugins/axios';

const stocks = ref([]);
const ingredients = ref([]);
const openModal = ref(false);
const isEditing = ref(false);
const successMessage = ref('');
const form = ref({
  ingredient_id: '',
  current_quantity: '',
  addQuantity: ''
});

const selectedIngredientName = computed(() => {
  const match = ingredients.value.find(i => i.id === form.value.ingredient_id);
  return match ? `${match.name} (${match.unit})` : '';
});

const availableIngredients = computed(() => {
  const existingIngredientIds = stocks.value.map(s => s.ingredient.id);
  return ingredients.value.filter(i => !existingIngredientIds.includes(i.id));
});

const loadStocks = async () => {
  const res = await api.get('/stocks');
  stocks.value = res.data;
};

const loadIngredients = async () => {
  const res = await api.get('/ingredients');
  ingredients.value = res.data;
};

function formatDate(dateTime) {
  return new Date(dateTime).toLocaleString();
}

function closeModal() {
  form.value = { ingredient_id: '', current_quantity: '', addQuantity: '' };
  openModal.value = false;
  isEditing.value = false;
}

function openAddForm() {
  form.value = { ingredient_id: '', addQuantity: '' };
  isEditing.value = false;
  openModal.value = true;
}

function editStock(stock) {
  form.value = {
    ingredient_id: stock.ingredient.id,
    current_quantity: stock.quantity,
    addQuantity: ''
  };
  isEditing.value = true;
  openModal.value = true;
}

async function updateStock() {
  try {
    let newQuantity = 0;
    if (isEditing.value) {
      const currentStock = stocks.value.find(s => s.ingredient.id === form.value.ingredient_id);
      const currentQty = parseFloat(currentStock?.quantity ?? 0);
      const additionalQty = parseFloat(form.value.addQuantity || 0);
      newQuantity = currentQty + additionalQty;
    } else {
      newQuantity = parseFloat(form.value.addQuantity || 0);
    }

    await api.post('/stocks', {
      ingredient_id: form.value.ingredient_id,
      quantity: newQuantity
    });

    successMessage.value = isEditing.value ? '✅ Stock updated successfully!' : '✅ Stock added successfully!';
    closeModal();
    await loadStocks();
    setTimeout(() => (successMessage.value = ''), 3000);
  } catch (err) {
    console.error('Update Error:', err);
  }
}

onMounted(() => {
  loadStocks();
  loadIngredients();
});
</script>

<style>
.custom-scroll::-webkit-scrollbar {
  display: none;
}

.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
