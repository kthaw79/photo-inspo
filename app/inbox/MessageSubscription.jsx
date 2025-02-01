'use client'
import { useEffect } from 'react'

export default function MessageSubscription({ 
    currentUser, 
    selectedConversation, 
    onNewMessage 
}) {
    useEffect(() => {
        const eventSource = new EventSource(`/api/messages/subscribe?userId=${currentUser.id}`)

        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data)
            onNewMessage(message)
        }

        return () => {
            eventSource.close()
        }
    }, [currentUser.id, onNewMessage])

    return null
} 