export type AppConfig = {
    sheetCsvUrl: string
}

export class ConfigError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ConfigError'
    }
}

export function getAppConfig(): AppConfig {
    const sheetCsvUrl = (import.meta as any).env?.VITE_SHEET_CSV_URL as string | undefined

    if (!sheetCsvUrl || sheetCsvUrl.trim().length === 0) {
        throw new ConfigError(
            'Missing VITE_SHEET_CSV_URL. Provide a public Google Sheet CSV URL (read-only).'
        )
    }

    return { sheetCsvUrl }
}
