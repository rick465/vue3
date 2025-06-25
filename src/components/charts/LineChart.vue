<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

Chart.register(...registerables)

interface Props {
  chartData: ChartData
  options?: ChartOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({})
})

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const createChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'line',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      ...props.options
    }
  })
}

const destroyChart = () => {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  destroyChart()
})

watch(() => props.chartData, () => {
  destroyChart()
  createChart()
}, { deep: true })

watch(() => props.options, () => {
  if (chart) {
    chart.options = {
      ...chart.options,
      ...props.options
    }
    chart.update()
  }
}, { deep: true })
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
