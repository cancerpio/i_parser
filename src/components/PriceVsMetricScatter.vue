<script setup lang="ts">
import { computed } from 'vue'
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import type { Brand, Device } from '../services/types'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title)

type MetricKey = 'specScore' | 'ram' | 'storage' | 'battery'

type MetricChoice = {
  key: MetricKey | null
  label: string
}

type Props = {
  devices: Device[]
}

const props = defineProps<Props>()

const METRIC_PRIORITY: Array<{ key: MetricKey; label: string }> = [
  { key: 'specScore', label: 'Spec Score' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'battery', label: 'Battery' },
]

function pickMetric(devices: Device[]): MetricChoice {
  for (const m of METRIC_PRIORITY) {
    if (devices.some((d) => d.metrics?.[m.key] != null)) return { key: m.key, label: m.label }
  }
  return { key: null, label: 'Rank' }
}

function brandPointStyle(brand: Brand): 'circle' | 'triangle' | 'rect' {
  if (brand === 'Asus') return 'circle'
  if (brand === 'Samsung') return 'triangle'
  return 'rect'
}

const metric = computed(() => pickMetric(props.devices))

const chartData = computed(() => {
  const brands: Brand[] = ['Asus', 'Samsung', 'Apple']
  const choice = metric.value

  if (choice.key) {
    return {
      datasets: brands.map((brand) => {
        const points = props.devices
          .filter((d) => d.brand === brand)
          .map((d) => {
            const y = d.metrics?.[choice.key!]
            return y == null ? null : { x: d.price, y }
          })
          .filter((p): p is { x: number; y: number } => p != null)

        return {
          label: brand,
          data: points,
          showLine: false,
          pointStyle: brandPointStyle(brand),
          backgroundColor: 'currentColor',
          borderColor: 'currentColor',
        }
      }),
    }
  }

  // Price-only fallback: show price vs rank per brand
  return {
    datasets: brands.map((brand) => {
      const sorted = props.devices
        .filter((d) => d.brand === brand)
        .slice()
        .sort((a, b) => a.price - b.price)

      const points = sorted.map((d, idx) => ({ x: d.price, y: idx + 1 }))

      return {
        label: brand,
        data: points,
        showLine: false,
        pointStyle: brandPointStyle(brand),
        backgroundColor: 'currentColor',
        borderColor: 'currentColor',
      }
    }),
  }
})

const chartOptions = computed(() => {
  const choice = metric.value
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: choice.key ? 'Price vs Metric' : 'Price Distribution (Rank)' },
    },
    scales: {
      x: {
        title: { display: true, text: 'Price' },
      },
      y: {
        title: { display: true, text: choice.key ? choice.label : 'Rank' },
      },
    },
  }
})
</script>

<template>
  <div class="h-80 rounded border p-3">
    <Scatter :data="chartData" :options="chartOptions" />
  </div>
</template>
