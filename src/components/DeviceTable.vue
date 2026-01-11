<script setup lang="ts">
import type { Device } from '../services/types'

type Props = {
  devices: Device[]
  metricLabel: string
  getMetricValue: (device: Device) => number | null
}

const props = defineProps<Props>()

function formatNumber(n: number): string {
  return n.toLocaleString()
}
</script>

<template>
  <div class="overflow-x-auto rounded border">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-3 py-2 text-left font-semibold">Brand</th>
          <th class="px-3 py-2 text-left font-semibold">Model</th>
          <th class="px-3 py-2 text-right font-semibold">Price</th>
          <th class="px-3 py-2 text-right font-semibold">{{ props.metricLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in props.devices" :key="`${d.brand}-${d.model}-${d.price}`" class="border-b last:border-b-0">
          <td class="px-3 py-2">{{ d.brand }}</td>
          <td class="px-3 py-2">{{ d.model }}</td>
          <td class="px-3 py-2 text-right tabular-nums">{{ formatNumber(d.price) }}</td>
          <td class="px-3 py-2 text-right tabular-nums">
            <span v-if="props.getMetricValue(d) != null">{{ formatNumber(props.getMetricValue(d)!) }}</span>
            <span v-else class="opacity-60">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
