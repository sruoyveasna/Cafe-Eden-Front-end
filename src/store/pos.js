// src/store/pos.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePOSStore = defineStore("pos", () => {
  const cart = ref([]);

  const addToCart = (product) => {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.value.push({ ...product, qty: 1 });
    }
  };

  const increaseQty = (id) => {
    const item = cart.value.find((i) => i.id === id);
    if (item) item.qty += 1;
  };

  const decreaseQty = (id) => {
    const item = cart.value.find((i) => i.id === id);
    if (item && item.qty > 1) {
      item.qty -= 1;
    } else {
      removeFromCart(id);
    }
  };

  const removeFromCart = (id) => {
    cart.value = cart.value.filter((i) => i.id !== id);
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  };
});
