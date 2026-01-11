export async function fetchCsvText(csvUrl: string): Promise<string> {
    const urlWithCacheBust = withCacheBust(csvUrl)

    const response = await fetch(urlWithCacheBust, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Accept: 'text/csv,*/*;q=0.9',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch CSV (HTTP ${response.status})`)
    }

    return await response.text()
}

function withCacheBust(url: string): string {
    try {
        const parsed = new URL(url)
        parsed.searchParams.set('_cb', String(Date.now()))
        return parsed.toString()
    } catch {
        const joiner = url.includes('?') ? '&' : '?'
        return `${url}${joiner}_cb=${Date.now()}`
    }
}
