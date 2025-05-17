<!-- src/components/Dashboard/DonutChart.vue -->
<template>
    <div class="w-full h-80 max-w-md mx-auto">
        <Doughnut :data="chartData" :options="chartOptions" v-if="hasData" />
        <p v-else class="text-red-500">⚠️ No data available for donut chart</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

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

const hasData = computed(() => props.labels.length > 0 && props.values.length > 0)

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: 'Top Items',
            backgroundColor: [
                '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
                '#3B82F6', '#F87171', '#FBBF24', '#34D399', '#60A5FA',
            ],
            data: props.values
        }
    ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right'
        }
    }
}
</script>
