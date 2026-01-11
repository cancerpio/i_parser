<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DeviceTable from '../components/DeviceTable.vue'
import PriceVsMetricScatter from '../components/PriceVsMetricScatter.vue'
import { useDataset } from '../composables/useDataset'
import { isPriceInBand, PRICE_BANDS } from '../services/priceBands'
import type { Device, PriceBand } from '../services/types'

const { state, refresh } = useDataset()

const selectedBandId = ref<string>('all')

const selectedBand = computed<PriceBand>(() => {
  return PRICE_BANDS.find((b) => b.id === selectedBandId.value) ?? PRICE_BANDS[0]!
})

const allDevices = computed<Device[]>(() => {
  return state.value.status === 'ready' ? state.value.dataset.devices : []
})

const filteredDevices = computed<Device[]>(() => {
  const band = selectedBand.value
  if (band.id === 'all') return allDevices.value
  return allDevices.value.filter((d) => isPriceInBand(d.price, band))
})

const brandCounts = computed(() => {
  const counts = { Asus: 0, Samsung: 0, Apple: 0 }
  for (const d of filteredDevices.value) counts[d.brand] += 1
  return counts
})

type MetricChoice = {
  label: string
  get: (device: Device) => number | null
}

function pickMetric(devices: Device[]): MetricChoice {
  const byKey: Array<{ label: string; get: (d: Device) => number | null }> = [
    { label: 'Spec Score', get: (d) => d.metrics?.specScore ?? null },
    { label: 'RAM', get: (d) => d.metrics?.ram ?? null },
    { label: 'Storage', get: (d) => d.metrics?.storage ?? null },
    { label: 'Battery', get: (d) => d.metrics?.battery ?? null },
  ]

  for (const m of byKey) {
    if (devices.some((d) => m.get(d) != null)) return m
  }

  return { label: 'Rank', get: () => null }
}

const metricChoice = computed(() => pickMetric(filteredDevices.value))

onMounted(() => {
  void refresh()
})
</script>

<template>
  <main class="min-h-full">
    <div class="mx-auto max-w-5xl px-4 py-6">
      <header class="mb-4">
        <h1 class="text-xl font-semibold">Phone Spec Visualizer</h1>
        <p class="text-sm opacity-80">Data source: public Google Sheet (read-only)</p>
      </header>

      <section v-if="state.status === 'loading'" class="rounded border p-4">
        Loading…
      </section>

      <section v-else-if="state.status === 'error'" class="rounded border p-4">
        <div class="font-semibold">Error</div>
        <div class="text-sm opacity-80">{{ state.error.message }}</div>

        <div v-if="state.error.kind === 'config'" class="mt-3 text-sm">
          <div class="font-semibold">設定方式</div>
          <ol class="mt-1 list-decimal space-y-1 pl-5 opacity-80">
            <li>在專案根目錄建立 <span class="font-mono">.env.local</span></li>
            <li>
              加上一行：
              <span class="font-mono">VITE_SHEET_CSV_URL=&lt;你的公開 Google Sheet CSV 連結&gt;</span>
            </li>
            <li>重新啟動開發伺服器</li>
          </ol>
          <div class="mt-2 opacity-80">
            範例：
            <span class="font-mono"
              >https://docs.google.com/spreadsheets/d/&lt;SHEET_ID&gt;/export?format=csv&amp;gid=&lt;GID&gt;</span
            >
          </div>
        </div>
        <div
          v-if="state.error.kind === 'missing_headers' && state.error.details?.missing"
          class="mt-2 text-sm"
        >
          Missing headers:
          <span class="opacity-80">{{ (state.error.details.missing as string[]).join(', ') }}</span>
        </div>
      </section>

      <section v-else-if="state.status === 'ready'" class="rounded border p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="text-sm">
              Loaded devices:
              <span class="font-semibold">{{ state.dataset.devices.length }}</span>
              <span class="opacity-60">·</span>
              Visible:
              <span class="font-semibold">{{ filteredDevices.length }}</span>
            </div>
            <div class="text-sm opacity-80">
              Asus: {{ brandCounts.Asus }} · Samsung: {{ brandCounts.Samsung }} · Apple:
              {{ brandCounts.Apple }}
              <span v-if="state.dataset.skippedRowCount">· Skipped: {{ state.dataset.skippedRowCount }}</span>
            </div>
          </div>

          <label class="text-sm">
            <span class="mr-2 opacity-80">Price band</span>
            <select v-model="selectedBandId" class="rounded border px-2 py-1">
              <option v-for="b in PRICE_BANDS" :key="b.id" :value="b.id">{{ b.label }}</option>
            </select>
          </label>
        </div>

        <div v-if="filteredDevices.length === 0" class="mt-4 rounded border p-4 text-sm">
          No devices match this price band.
        </div>

        <div v-else class="mt-4 space-y-4">
          <PriceVsMetricScatter :devices="filteredDevices" />
          <DeviceTable
            :devices="filteredDevices"
            :metric-label="metricChoice.label"
            :get-metric-value="metricChoice.get"
          />
        </div>
      </section>

      <section v-else class="rounded border p-4">Idle</section>
    </div>
  </main>
</template>
