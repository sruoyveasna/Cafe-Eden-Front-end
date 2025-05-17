<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Register
      </h2>

      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Your name"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            v-model="form.password_confirmation"
            type="password"
            placeholder="Confirm Password"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-400"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Register
        </button>
      </form>

      <p v-if="errorMessage" class="text-red-600 mt-4 text-center">
        {{ errorMessage }}
      </p>

      <div class="text-center mt-4">
        <router-link
          to="/login"
          class="text-sm text-indigo-600 hover:underline"
        >
          Already have an account? Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/plugins/axios";

const router = useRouter();

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const errorMessage = ref("");

const register = async () => {
  try {
    const response = await api.post("/register", form.value);

    // Store token and redirect
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;

    router.push("/dashboard");
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Registration failed.";
  }
};
</script>
