import Papa from 'papaparse'
import type { Brand, Dataset, Device } from './types'

const REQUIRED_HEADERS = ['Brand', 'Model', 'Price'] as const

type RequiredHeader = (typeof REQUIRED_HEADERS)[number]

type SkipReason = 'missing_required_fields' | 'invalid_price' | 'non_target_brand'

function normalizeBrand(value: unknown): Brand | null {
    if (typeof value !== 'string') return null
    const s = value.trim().toLowerCase()
    if (s === 'asus') return 'Asus'
    if (s === 'samsung') return 'Samsung'
    if (s === 'apple') return 'Apple'
    return null
}

function parsePositiveNumber(value: unknown): number | null {
    if (typeof value === 'number') return value > 0 ? value : null
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (trimmed.length === 0) return null

    const normalized = trimmed.replace(/,/g, '')
    const num = Number(normalized)
    if (!Number.isFinite(num) || num <= 0) return null
    return num
}

function hasRequiredHeaders(headers: string[] | undefined): headers is RequiredHeader[] {
    if (!headers) return false
    const set = new Set(headers)
    return REQUIRED_HEADERS.every((h) => set.has(h))
}

export type ParseFailure =
    | { kind: 'missing_headers'; missing: string[] }
    | { kind: 'parse'; message: string }

export function parseDevicesFromCsv(
    csvText: string,
    csvUrl: string
): { ok: true; dataset: Dataset } | { ok: false; error: ParseFailure } {
    const parsed = Papa.parse<Record<string, unknown>>(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: false,
    })

    if (parsed.errors?.length) {
        return {
            ok: false,
            error: {
                kind: 'parse',
                message: parsed.errors[0]?.message ?? 'CSV parse error',
            },
        }
    }

    const fields = parsed.meta?.fields
    if (!hasRequiredHeaders(fields)) {
        const missing = REQUIRED_HEADERS.filter((h) => !(fields ?? []).includes(h))
        return { ok: false, error: { kind: 'missing_headers', missing: [...missing] } }
    }

    const devices: Device[] = []
    let skippedRowCount = 0
    const skipReasons: Record<SkipReason, number> = {
        missing_required_fields: 0,
        invalid_price: 0,
        non_target_brand: 0,
    }

    for (const row of parsed.data ?? []) {
        const brandRaw = row['Brand']
        const modelRaw = row['Model']
        const priceRaw = row['Price']

        if (brandRaw == null || modelRaw == null || priceRaw == null) {
            skippedRowCount += 1
            skipReasons.missing_required_fields += 1
            continue
        }

        const brand = normalizeBrand(brandRaw)
        if (!brand) {
            skippedRowCount += 1
            skipReasons.non_target_brand += 1
            continue
        }

        const model = typeof modelRaw === 'string' ? modelRaw.trim() : String(modelRaw).trim()
        if (!model) {
            skippedRowCount += 1
            skipReasons.missing_required_fields += 1
            continue
        }

        const price = parsePositiveNumber(priceRaw)
        if (!price) {
            skippedRowCount += 1
            skipReasons.invalid_price += 1
            continue
        }

        const metrics: Device['metrics'] = {}
        const specScore = parsePositiveNumber(row['Spec_Score'])
        const ram = parsePositiveNumber(row['Ram'])
        const storage = parsePositiveNumber(row['Storage'])
        const battery = parsePositiveNumber(row['Battery'])

        if (specScore != null) metrics.specScore = specScore
        if (ram != null) metrics.ram = ram
        if (storage != null) metrics.storage = storage
        if (battery != null) metrics.battery = battery

        devices.push({
            brand,
            model,
            price,
            metrics: Object.keys(metrics).length ? metrics : undefined,
            raw: row,
        })
    }

    return {
        ok: true,
        dataset: {
            devices,
            skippedRowCount,
            skipReasons,
            source: {
                csvUrl,
                fetchedAt: new Date().toISOString(),
            },
        },
    }
}
