'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function InboxClient({ initialConversations, currentUser }) {
    const [conversations, setConversations] = useState(initialConversations)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const supabase = createClientComponentClient()

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversation) return

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    sender_id: currentUser.id,
                    receiver_id: currentUser.id === selectedConversation.user1_id 
                        ? selectedConversation.user2_id 
                        : selectedConversation.user1_id,
                    content: newMessage.trim()
                })

            if (error) throw error
            setNewMessage('')
            
            // Refresh the conversation
            const { data, error: fetchError } = await supabase
                .from('messages')
                .select('*, sender:sender_id(email), receiver:receiver_id(email)')
                .or(
                    `and(sender_id.eq.${selectedConversation.user1_id},receiver_id.eq.${selectedConversation.user2_id}),
                     and(sender_id.eq.${selectedConversation.user2_id},receiver_id.eq.${selectedConversation.user1_id})`
                )
                .order('created_at', { ascending: true })

            if (!fetchError && data) {
                setSelectedConversation({
                    ...selectedConversation,
                    messages: data
                })
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const getOtherUserEmail = (conversation) => {
        return currentUser.id === conversation.user1_id 
            ? conversation.user2.email 
            : conversation.user1.email
    }

    return (
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6">
            <div className="flex gap-6">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-gray-700 pr-6">
                    <h2 className="text-xl font-bold mb-4">Conversations</h2>
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <button
                                key={`${conversation.user1_id}-${conversation.user2_id}`}
                                onClick={() => setSelectedConversation(conversation)}
                                className={`w-full text-left p-3 rounded-lg transition ${
                                    selectedConversation === conversation
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
                                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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
                                            <p className="text-xs text-gray-300 mt-1">
                                                {new Date(message.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
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
    )
} 