'use client'
import { useState, useRef, useEffect } from 'react'
import { sendMessageAndRefresh } from './actions'
import MessageSubscription from './MessageSubscription'

export default function InboxClient({ 
    initialConversations, 
    currentUser, 
    initialSelectedConversation 
}) {
    const [conversations, setConversations] = useState(initialConversations)
    const [selectedConversation, setSelectedConversation] = useState(initialSelectedConversation)
    const [newMessage, setNewMessage] = useState('')
    const messagesContainerRef = useRef(null)
    const messagesEndRef = useRef(null)

    // Scroll to bottom instantly (for conversation changes)
    const scrollToBottomInstant = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
    }

    // Smooth scroll from current position (for new messages)
    const scrollToBottomSmooth = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Scroll to bottom when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            scrollToBottomInstant()
        }
    }, [selectedConversation?.user1_id, selectedConversation?.user2_id])

    // Helper function to check if two conversations are the same
    const isSameConversation = (conv1, conv2) => {
        const ids1 = [conv1.user1_id, conv1.user2_id].sort().join('-')
        const ids2 = [conv2.user1_id, conv2.user2_id].sort().join('-')
        return ids1 === ids2
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversation) return

        const tempId = `temp-${Date.now()}`
        const optimisticMessage = {
            id: tempId,
            sender_id: currentUser.id,
            receiver_id: currentUser.id === selectedConversation.user1_id 
                ? selectedConversation.user2_id 
                : selectedConversation.user1_id,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
            status: 'sending',
            sender: { id: currentUser.id, email: currentUser.email }
        }

        // Add optimistic message
        const updatedMessages = [...selectedConversation.messages, optimisticMessage]
        setSelectedConversation({
            ...selectedConversation,
            messages: updatedMessages,
            last_message_at: optimisticMessage.created_at
        })
        setNewMessage('')
        setTimeout(scrollToBottomSmooth, 100)

        try {
            const serverMessages = await sendMessageAndRefresh(
                currentUser.id,
                selectedConversation, 
                optimisticMessage.content
            )
            
            if (serverMessages) {
                const updatedSelectedConversation = {
                    ...selectedConversation,
                    messages: serverMessages,
                    last_message_at: serverMessages[serverMessages.length - 1].created_at
                }
                setSelectedConversation(updatedSelectedConversation)

                setConversations(prevConversations => {
                    const updatedConversations = prevConversations.map(conv => 
                        isSameConversation(conv, selectedConversation) 
                            ? updatedSelectedConversation 
                            : conv
                    )
                    return [...updatedConversations].sort((a, b) => 
                        new Date(b.last_message_at) - new Date(a.last_message_at)
                    )
                })
            }
        } catch (error) {
            console.error('Error sending message:', error)
            // Update the optimistic message to show error
            setSelectedConversation(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                    msg.id === tempId 
                        ? { ...msg, status: 'error' }
                        : msg
                )
            }))
        }
    }

    const getOtherUserEmail = (conversation) => {
        const email = currentUser.id === conversation.user1_id 
            ? conversation.user2.email 
            : conversation.user1.email
        
        if (email === currentUser.email) return 'Me';

        // Truncate email at @ symbol
        const [username, domain] = email.split('@')
        return username.length > 15
            ? username.substring(0, 13) + '...@' + domain
            : email
    }

    const handleNewMessage = (message) => {
        // Get conversation ID
        const conversationId = [message.sender_id, message.receiver_id].sort().join('-')
        
        // Update conversations state
        setConversations(prevConversations => {
            const existingConversation = prevConversations.find(conv => {
                const convId = [conv.user1_id, conv.user2_id].sort().join('-')
                return convId === conversationId
            })

            if (existingConversation) {
                const updatedConversation = {
                    ...existingConversation,
                    messages: [...existingConversation.messages, message],
                    last_message_at: message.created_at
                }

                const updatedConversations = prevConversations.map(conv => 
                    isSameConversation(conv, existingConversation) 
                        ? updatedConversation 
                        : conv
                )

                // Update selected conversation if it's the current one
                if (selectedConversation && isSameConversation(selectedConversation, existingConversation)) {
                    setSelectedConversation(updatedConversation)
                    setTimeout(scrollToBottomSmooth, 100)
                }

                return [...updatedConversations].sort((a, b) => 
                    new Date(b.last_message_at) - new Date(a.last_message_at)
                )
            }

            return prevConversations
        })
    }

    return (
        <>
            <MessageSubscription 
                currentUser={currentUser}
                selectedConversation={selectedConversation}
                onNewMessage={handleNewMessage}
            />
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6">
                <div className="flex gap-6">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r border-gray-700 pr-6">
                        <h2 className="text-xl font-bold mb-4">Conversations</h2>
                        <div className="space-y-2">
                            {conversations.map((conversation) => (
                                <button
                                    key={[conversation.user1_id, conversation.user2_id].sort().join('-')}
                                    onClick={() => setSelectedConversation(conversation)}
                                    className={`w-full text-left p-3 rounded-lg transition ${
                                        selectedConversation && isSameConversation(selectedConversation, conversation)
                                            ? 'bg-blue-500'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    <p className="font-semibold">{getOtherUserEmail(conversation)}</p>
                                    <p className="text-sm text-gray-300">
                                        {new Date(conversation.last_message_at).toLocaleDateString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1">
                        {selectedConversation ? (
                            <>
                                <h2 className="text-xl font-bold mb-4">
                                    Chat with {getOtherUserEmail(selectedConversation)}
                                </h2>
                                <div className="h-[500px] flex flex-col">
                                    <div className="flex-1 overflow-y-auto mb-4 space-y-4" ref={messagesContainerRef}>
                                        {selectedConversation.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`max-w-[80%] p-3 rounded-lg ${
                                                    message.sender_id === currentUser.id
                                                        ? 'ml-auto bg-blue-500'
                                                        : 'bg-gray-700'
                                                }`}
                                            >
                                                <p>{message.content}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-gray-300">
                                                        {new Date(message.created_at).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </p>
                                                    {message.sender_id === currentUser.id && (
                                                        <span className="text-xs text-gray-300 ml-2">
                                                            {message.status === 'sending' ? '• Sending...' : 
                                                             message.status === 'error' ? '• Failed' : 
                                                             '• Delivered'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="h-[500px] flex items-center justify-center text-gray-400">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
} 