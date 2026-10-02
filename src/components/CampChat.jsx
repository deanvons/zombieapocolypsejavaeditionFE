import { useEffect, useRef, useState } from 'react'
import {
    getCampMessages,
    sendCampMessage,
    startCampVisit,
    subscribeToCampMessages,
} from '../service/camp-chat-service'
import '../css/CampChat.css'

const MAX_MESSAGE_LENGTH = 500

function getMessageLength(value) {
    return Array.from(value).length
}

function formatTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(timestamp))
}

function mergeMessages(current, incoming) {
    const byId = new Map(current.map((message) => [message.id, message]))
    incoming.forEach((message) => byId.set(message.id, message))
    return [...byId.values()].sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))
}

export default function CampChat() {
    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sending, setSending] = useState(false)
    const [visitId, setVisitId] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('connecting')
    const messageListRef = useRef(null)
    const visitPromiseRef = useRef(null)

    useEffect(() => {
        let active = true
        let closeStream = () => {}

        async function enterCamp() {
            try {
                visitPromiseRef.current ??= startCampVisit()
                const visit = await visitPromiseRef.current
                if (!active) return

                setVisitId(visit.visitId)
                const stream = subscribeToCampMessages(
                    visit.visitId,
                    (message) => {
                        if (active) setMessages((current) => mergeMessages(current, [message]))
                    },
                    (status) => {
                        if (active) setConnectionStatus(status)
                    },
                    (streamError) => {
                        if (active) setError(streamError.message || 'The camp channel disconnected.')
                    },
                )
                closeStream = stream.close
                stream.ready.catch((streamError) => {
                    if (active) setError(streamError.message || 'The camp channel could not be connected.')
                })

                let cursor = null
                do {
                    const page = await getCampMessages(visit.visitId, cursor)
                    if (!active) return
                    setMessages((current) => mergeMessages(current, page.items))
                    cursor = page.nextCursor
                } while (cursor)
            } catch (visitError) {
                if (active) setError(visitError.message || 'Camp chat could not be opened.')
            } finally {
                if (active) setLoading(false)
            }
        }

        void enterCamp()

        return () => {
            active = false
            closeStream()
        }
    }, [])

    useEffect(() => {
        const list = messageListRef.current
        if (list) list.scrollTop = list.scrollHeight
    }, [messages])

    async function handleSubmit(event) {
        event.preventDefault()
        const content = messageText.trim()
        if (!content || sending) return

        setSending(true)
        setError('')
        try {
            const sentMessage = await sendCampMessage(visitId, content)
            setMessages((current) => mergeMessages(current, [sentMessage]))
            setMessageText('')
        } catch (sendError) {
            setError(sendError.message || 'Your message could not be sent. Try again.')
        } finally {
            setSending(false)
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
        }
    }

    return (
        <section className="camp-chat" aria-labelledby="camp-chat-title">
            <header className="camp-chat-header">
                <div>
                    <p className="camp-page-kicker">CAMP CHANNEL</p>
                    <h2 id="camp-chat-title">Messages</h2>
                </div>
                <span
                    className={`camp-chat-connection-status camp-chat-connection-${connectionStatus}`}
                    aria-live="polite"
                >
                    {connectionStatus === 'connected' ? 'LIVE' : connectionStatus.toUpperCase()}
                </span>
            </header>

            <div className="camp-chat-visit-note">Showing messages from this visit</div>

            <div className="camp-chat-messages" ref={messageListRef} aria-live="polite" aria-relevant="additions">
                {loading ? (
                    <p className="camp-chat-state">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <div className="camp-chat-empty">
                        <span className="camp-chat-empty-mark" aria-hidden="true">...</span>
                        <p>No messages yet.</p>
                        <span>Start the conversation.</span>
                    </div>
                ) : (
                    <ol className="camp-chat-list">
                        {messages.map((message) => (
                            <li className="camp-chat-message" key={message.id}>
                                <div className="camp-chat-message-meta">
                                    <strong>{message.senderName}</strong>
                                    <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
                                </div>
                                <p>{message.content}</p>
                            </li>
                        ))}
                    </ol>
                )}
            </div>

            {error && <p className="camp-chat-error" role="alert">{error}</p>}

            <form className="camp-chat-compose" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="camp-chat-input">Message your camp</label>
                <textarea
                    id="camp-chat-input"
                    value={messageText}
                    onChange={(event) => {
                        setMessageText(Array.from(event.target.value).slice(0, MAX_MESSAGE_LENGTH).join(''))
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something to the camp..."
                    rows={2}
                />
                <div className="camp-chat-compose-footer">
                    <span>{getMessageLength(messageText)}/{MAX_MESSAGE_LENGTH}</span>
                    <button type="submit" disabled={!messageText.trim() || sending || !visitId}>
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </section>
    )
}