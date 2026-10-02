import { getAuthHeaders } from './token-service'

const API_URL = import.meta.env.VITE_API_URL
const CAMP_API_URL = `${API_URL}/api/camp`
const MAX_PAGE_SIZE = 100
const RECONNECT_DELAY_MS = 1500

function getErrorMessage(response, body) {
    return body?.message ?? `Camp chat request failed: ${response.status}`
}

async function requestJson(path, options = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${CAMP_API_URL}${path}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    })

    if (!response.ok) {
        const body = await response.json().catch(() => null)
        const error = new Error(getErrorMessage(response, body))
        error.status = response.status
        throw error
    }

    return response.json()
}

export async function startCampVisit() {
    return requestJson('/visits', { method: 'POST' })
}

export async function getCampMessages(visitId, cursor = null) {
    const params = new URLSearchParams({ limit: String(MAX_PAGE_SIZE) })
    if (cursor) params.set('cursor', cursor)
    return requestJson(`/visits/${encodeURIComponent(visitId)}/messages?${params}`)
}

export async function sendCampMessage(visitId, content) {
    return requestJson(`/visits/${encodeURIComponent(visitId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    })
}

async function loadVisitMessages(visitId, onMessage) {
    let cursor = null

    do {
        const page = await getCampMessages(visitId, cursor)
        page.items.forEach(onMessage)
        cursor = page.nextCursor
    } while (cursor)
}

function parseEventBlock(block, onMessage) {
    let eventName = 'message'
    const data = []

    for (const line of block.split('\n')) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim()
        if (line.startsWith('data:')) data.push(line.slice(5).trimStart())
    }

    if (eventName === 'message.created' && data.length > 0) {
        onMessage(JSON.parse(data.join('\n')))
    }
}

async function consumeEventStream(response, onMessage, signal) {
    if (!response.body) throw new Error('Camp chat stream returned no response body')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
        while (!signal.aborted) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
            let separator = buffer.indexOf('\n\n')
            while (separator !== -1) {
                parseEventBlock(buffer.slice(0, separator), onMessage)
                buffer = buffer.slice(separator + 2)
                separator = buffer.indexOf('\n\n')
            }
        }
    } finally {
        reader.releaseLock()
    }
}

function waitForReconnect(signal) {
    return new Promise((resolve) => {
        function finish() {
            signal.removeEventListener('abort', onAbort)
            resolve()
        }

        const timeout = setTimeout(finish, RECONNECT_DELAY_MS)
        function onAbort() {
            clearTimeout(timeout)
            finish()
        }
        signal.addEventListener('abort', onAbort, { once: true })
    })
}

export function subscribeToCampMessages(visitId, onMessage, onStatus, onError) {
    const controller = new AbortController()
    let connectedOnce = false
    let resolveReady
    let rejectReady
    const ready = new Promise((resolve, reject) => {
        resolveReady = resolve
        rejectReady = reject
    })

    async function connect() {
        while (!controller.signal.aborted) {
            try {
                onStatus(connectedOnce ? 'reconnecting' : 'connecting')
                const headers = await getAuthHeaders()
                headers.Accept = 'text/event-stream'
                const response = await fetch(
                    `${CAMP_API_URL}/visits/${encodeURIComponent(visitId)}/events`,
                    { headers, signal: controller.signal },
                )

                if (!response.ok) {
                    const body = await response.json().catch(() => null)
                    const error = new Error(getErrorMessage(response, body))
                    error.status = response.status
                    throw error
                }

                const isReconnect = connectedOnce
                connectedOnce = true
                resolveReady()
                onStatus('connected')

                if (isReconnect) {
                    await loadVisitMessages(visitId, onMessage)
                }

                await consumeEventStream(response, onMessage, controller.signal)
            } catch (error) {
                if (controller.signal.aborted) return

                if ([401, 403, 404].includes(error.status)) {
                    if (!connectedOnce) rejectReady(error)
                    onStatus('disconnected')
                    onError(error)
                    return
                }

                if (!connectedOnce) onStatus('reconnecting')
                else onStatus('reconnecting')
            }

            if (!controller.signal.aborted) {
                onStatus('reconnecting')
                await waitForReconnect(controller.signal)
            }
        }
    }

    void connect()
    return {
        ready,
        close: () => controller.abort(),
    }
}