export type Brand = 'Asus' | 'Samsung' | 'Apple'

export type Device = {
    brand: Brand
    model: string
    price: number
    metrics?: {
        specScore?: number
        ram?: number
        storage?: number
        battery?: number
    }
    raw?: Record<string, unknown>
}

export type PriceBand = {
    id: string
    label: string
    min: number
    max: number | null // null = no upper bound
}

export type Dataset = {
    devices: Device[]
    skippedRowCount: number
    skipReasons: Record<string, number>
    source: {
        csvUrl: string
        fetchedAt: string
    }
}

export type DatasetErrorKind = 'config' | 'network' | 'parse' | 'missing_headers'

export type DatasetError = {
    kind: DatasetErrorKind
    message: string
    details?: Record<string, unknown>
}

export type DatasetState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ready'; dataset: Dataset }
    | { status: 'error'; error: DatasetError }
