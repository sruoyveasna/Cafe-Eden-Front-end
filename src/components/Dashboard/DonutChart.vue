<template>
  <div class="w-full bg-white rounded-2xl shadow-md px-6 py-5 flex flex-col space-y-4">
    <!-- Title -->
    <div>
      <h2 class="text-base font-semibold text-gray-800">🍩 {{ $t('top_items.title') }}</h2>
      <p class="text-xs text-gray-500">{{ $t('top_items.subtitle') }}</p>
    </div>

    <!-- Chart Area -->
    <div class="relative h-[300px]">
      <Doughnut
        v-if="hasData"
        :data="chartData"
        :options="chartOptions"
        class="absolute inset-0"
      />
      <p v-else class="text-gray-400 text-sm text-center pt-12">
        ⚠️ {{ $t('top_items.no_data') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const { t } = useI18n()

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  }
})

const hasData = computed(() =>
  props.labels.length > 0 && props.values.some(v => v > 0)
)

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: t('top_items.dataset_label'),
      data: props.values,
      backgroundColor: [
        '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
        '#3B82F6', '#F87171', '#FBBF24', '#34D399', '#60A5FA'
      ],
      borderColor: '#ffffff',
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#374151',
        usePointStyle: true,
        padding: 14,
        boxWidth: 12,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#F9FAFB',
      bodyColor: '#D1D5DB',
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.raw} ${t('top_items.orders')}`
      }
    }
  }
}
</script>
