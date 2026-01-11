export async function fetchCsvText(csvUrl: string): Promise<string> {
    const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
            Accept: 'text/csv,*/*;q=0.9',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch CSV (HTTP ${response.status})`)
    }

    return await response.text()
}
