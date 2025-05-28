<template>
  <AppLayout>
    <div class="p-8 max-w-5xl mx-auto space-y-10">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          👨‍💻 Meet the Developers
        </h1>
        <p class="text-gray-500 mt-2 max-w-2xl mx-auto text-sm">
          This POS system was developed by a passionate team as part of a real-world thesis project focused on optimizing cafe operations.
        </p>
      </div>

      <!-- Developer Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <article
          v-for="dev in developers"
          :key="dev.name"
          class="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition"
        >
          <img
            :src="dev.avatar"
            :alt="`Photo of ${dev.name}`"
            class="w-16 h-16 rounded-full object-cover border border-gray-200"
          />
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-800">{{ dev.name }}</h2>
            <p class="text-sm text-gray-500 mb-1">{{ dev.role }}</p>
            <a
              :href="dev.contact"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm text-purple-600 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12c0 4.93 3.99 9 9 9s9-4.07 9-9c0-5.52-4.48-10-9-10zm1.28 14.41l-.6.58c-.19.18-.5.17-.69 0l-2.28-2.24a.5.5 0 010-.71l.6-.59a.5.5 0 01.71 0l1.08 1.07 2.88-2.88a.5.5 0 01.71 0l.59.6a.5.5 0 010 .71l-3.99 4z"
                />
              </svg>
              Telegram
            </a>
          </div>
        </article>
      </section>

      <!-- Project Overview -->
      <section class="bg-white shadow rounded-xl p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
        <p>
          <strong class="text-purple-700">Cafe Eden POS</strong> is a modern, web-based point-of-sale solution built to manage cafe workflows efficiently — including inventory, payments, and reports — with a responsive and user-friendly design.
        </p>
        <ul class="list-disc ml-5 space-y-1">
          <li>Real-time POS and QR-based ordering</li>
          <li>Inventory and ingredient-level recipe tracking</li>
          <li>Discounts, loyalty, and promotional support</li>
          <li>Dashboard analytics with role-based access</li>
        </ul>
        <p>
          💻 <strong>Technologies:</strong> Laravel 12, Vue 3, Tailwind CSS, MySQL, Laravel Sanctum
        </p>
        <p>
          📅 <strong>Project Timeline:</strong> January – May 2025
        </p>
        <!-- <p>
          🔗
          <a
            href="https://github.com/Konthaina/Cafe-Eden"
            class="text-purple-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source Code on GitHub
          </a>
        </p> -->
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/Common/AppLayout.vue'

const developers = [
  {
    name: 'Kon Thaina',
    role: 'Frontend Developer & UI/UX Designer',
    avatar: '/images/thaina.jpg',
    contact: 'https://t.me/konthaina87'
  },
  {
    name: 'Koy Hokleng',
    role: 'Team Leader & Full-stack Developer',
    avatar: '/images/hokleng.jpg',
    contact: 'https://t.me/koyhokleng'
  },
  {
    name: 'Yem Mai',
    role: 'Frontend Developer & DB Administrator',
    avatar: '/images/mai.jpg',
    contact: 'https://t.me/yemmai'
  },
  {
    name: 'Sruoy Veasna',
    role: 'Backend Developer & API Specialist',
    avatar: '/images/veasna.jpg',
    contact: 'https://t.me/sruoyveasna'
  }
]
</script>
