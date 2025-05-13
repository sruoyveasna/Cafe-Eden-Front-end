<template> 
  <AppLayout>
    <div class="flex gap-6">
      <!-- POS Main Section -->
      <div class="flex-1 space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">New Order</h1>
          <input
            v-model="search"
            placeholder="Search..."
            class="border px-3 py-2 rounded w-64"
          />
        </div>

        <!-- Categories -->
        <div class="flex gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-4 py-1 rounded-full text-sm',
              activeCategory === cat.id
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-200'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <template v-if="filteredProducts.length">
            <ProductCard
              v-for="item in filteredProducts"
              :key="item.id"
              :item="item"
              @add-to-cart="addToCart"
            />
          </template>
          <template v-else>
            <p class="text-gray-500 col-span-full">No products found.</p>
          </template>
        </div>
      </div>

      <!-- Cart Panel -->
      <Cart @checkout="handleCheckout" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AppLayout from '@/components/Common/AppLayout.vue';
import ProductCard from '@/components/POS/ProductCard.vue';
import Cart from '@/components/POS/Cart.vue';
import api from '@/plugins/axios';
import { usePOSStore } from '@/store/pos';

const { cart, addToCart, clearCart } = usePOSStore();

const products = ref([]);
const categories = ref([{ id: 0, name: 'All' }]);
const activeCategory = ref(0);
const search = ref('');

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchCategory =
      activeCategory.value === 0 || p.category_id === activeCategory.value;
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
    return matchCategory && matchSearch;
  })
);

// Debug watch
watch(filteredProducts, (newVal) => {
  console.log('Filtered Products:', newVal);
});

onMounted(async () => {
  const [menuRes, catRes] = await Promise.all([
    api.get('/menu-items'),
    api.get('/categories'),
  ]);

  console.log('MENU:', menuRes.data);
  console.log('CATEGORIES:', catRes.data);

  products.value = menuRes.data;
  categories.value.push(...catRes.data);
});

const handleCheckout = async () => {
  if (cart.length === 0) return alert('Cart is empty');

  try {
    const res = await api.post('/orders', {
      items: cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.qty,
      })),
    });

    await api.post(`/orders/${res.data.id}/pay`, {
      payment_method: 'cash',
    });

    alert('Order placed successfully!');
    clearCart();
  } catch (err) {
    console.error(err);
    alert('Order failed.');
  }
};
</script>
