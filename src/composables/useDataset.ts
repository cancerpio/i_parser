import { computed, ref } from 'vue'
import { getAppConfig } from '../services/config'
import { parseDevicesFromCsv } from '../services/deviceParser'
import { fetchCsvText } from '../services/sheetsClient'
import type { DatasetState } from '../services/types'

export function useDataset() {
    const state = ref<DatasetState>({ status: 'idle' })

    async function refresh() {
        try {
            state.value = { status: 'loading' }

            const config = getAppConfig()
            const csvText = await fetchCsvText(config.sheetCsvUrl)
            const parsed = parseDevicesFromCsv(csvText, config.sheetCsvUrl)

            if (!parsed.ok) {
                if (parsed.error.kind === 'missing_headers') {
                    state.value = {
                        status: 'error',
                        error: {
                            kind: 'missing_headers',
                            message: 'Missing required headers in Google Sheet.',
                            details: { missing: parsed.error.missing },
                        },
                    }
                    return
                }

                state.value = {
                    status: 'error',
                    error: {
                        kind: 'parse',
                        message: parsed.error.message,
                    },
                }
                return
            }

            state.value = { status: 'ready', dataset: parsed.dataset }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            const kind = message.includes('VITE_SHEET_CSV_URL') ? 'config' : 'network'
            state.value = { status: 'error', error: { kind, message } }
        }
    }

    const dataset = computed(() => (state.value.status === 'ready' ? state.value.dataset : null))

    return {
        state,
        dataset,
        refresh,
    }
}
