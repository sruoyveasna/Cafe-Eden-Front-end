<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Reset Your Password
      </h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >New Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="New password"
            class="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            v-model="passwordConfirmation"
            type="password"
            placeholder="Confirm password"
            class="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded font-semibold transition"
        >
          Reset Password
        </button>
      </form>

      <p v-if="successMessage" class="text-green-600 mt-4 text-center">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-red-600 mt-4 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/axios";

const route = useRoute();
const router = useRouter();

const email = ref("");
const token = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const successMessage = ref("");
const errorMessage = ref("");

onMounted(() => {
  token.value = route.query.token || "";
  email.value = route.query.email || "";
});

const submit = async () => {
  try {
    const res = await axios.post("/reset-password", {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    successMessage.value = "Password has been reset successfully!";
    errorMessage.value = "";

    setTimeout(() => router.push("/login"), 2000);
  } catch (err) {
    successMessage.value = "";
    errorMessage.value =
      err.response?.data?.message || "Reset failed. Try again.";
  }
};
</script>
