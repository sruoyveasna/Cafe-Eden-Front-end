<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Forgot Password
      </h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required />
        </div>

        <button type="submit"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded font-semibold transition">
          Send Reset Link
        </button>
      </form>

      <p v-if="successMessage" class="text-green-600 mt-4 text-center">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-red-600 mt-4 text-center">
        {{ errorMessage }}
      </p>

      <div class="text-center mt-4 text-sm">
        <router-link to="/login" class="text-indigo-500 hover:underline">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";

const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const submit = async () => {
  try {
    await axios.post("/forgot-password", { email: email.value });
    successMessage.value = "Reset link has been sent to your email.";
    errorMessage.value = "";
  } catch (err) {
    successMessage.value = "";
    errorMessage.value =
      err.response?.data?.message || "Failed to send reset link.";
  }
};
</script>
