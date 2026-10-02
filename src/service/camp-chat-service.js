let nextMessageId = 1
const mockMessages = []
const listeners = new Set()

export async function getCampMessages(visitStartedAt) {
    const visitTimestamp = new Date(visitStartedAt).getTime()
    return mockMessages.filter((message) => new Date(message.createdAt).getTime() >= visitTimestamp)
}

export async function sendCampMessage(content, senderName) {
    const message = {
        id: `local-${nextMessageId++}`,
        content,
        senderName,
        createdAt: new Date().toISOString(),
    }

    mockMessages.push(message)
    listeners.forEach((listener) => listener(message))
    return message
}

export function subscribeToCampMessages(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}