<template>
  <MainLayout>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Sales" :value="summary.total_revenue + ' USD'" icon="💵" />
        <StatsCard title="Total Orders" :value="summary.order_count" icon="📦" />
        <StatsCard title="Total Customers" :value="totalCustomers" icon="👥" />
        <StatsCard title="Top Item" :value="topItem" icon="🍽️" />
      </div>

      <!-- Donut Chart for Top Items -->
      <!-- Combined Donut and Bar Chart Section -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Top Selling Items</h2>

        <div v-if="topItemLabels.length && topItemValues.some(v => v > 0)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="h-[300px]">
              <DonutChart :labels="topItemLabels" :values="topItemValues" />
            </div>
            <div class="h-[300px] overflow-x-auto">
              <BarChart :labels="topItemLabels" :values="topItemValues" />
            </div>
          </div>
        </div>

        <p v-else class="text-gray-500 text-sm text-center mt-6">
          No top items to display yet.
        </p>
      </div>


    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '@/components/Common/AppLayout.vue'
import StatsCard from '@/components/Dashboard/StatsCard.vue'
import BarChart from '@/components/Dashboard/BarChart.vue'
import DonutChart from '@/components/Dashboard/DonutChart.vue'
import api from '@/plugins/axios'

const summary = ref({
  total_revenue: 0,
  order_count: 0,
  date: ''
})

const stats = ref([])
const totalCustomers = ref(0)
const topItem = ref('N/A')
const topItemLabels = ref([])
const topItemValues = ref([])

onMounted(async () => {
  try {
    const [res1, res2, res3, res4] = await Promise.all([
      api.get('/reports/summary'),
      api.get('/reports/stats'),
      api.get('/users'),
      api.get('/reports/top-items')
    ])

    summary.value = res1.data
    stats.value = Array.isArray(res2.data)
      ? res2.data.map(item => ({
        date: item.date ?? 'Unknown',
        total_revenue: item.total_revenue ?? 0
      }))
      : []

    totalCustomers.value = res3.data.filter(user => user.role_id === 4).length
    topItem.value = res4.data[0]?.name ?? 'N/A'
    topItemLabels.value = Array.isArray(res4.data) ? res4.data.map(item => item.name) : []
    topItemValues.value = Array.isArray(res4.data) ? res4.data.map(item => item.total_orders ?? 0) : []
  } catch (err) {
    console.error('Dashboard load error:', err)
  }
})
</script>
