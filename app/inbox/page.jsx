import Nav from "../components/Nav"
import SignOutButton from "../components/SignOutButton"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import InboxClient from "./InboxClient"
import { redirect } from "next/navigation"

export default async function Inbox() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                }
            }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:user_profiles!sender_id(id, email),
            receiver:user_profiles!receiver_id(id, email)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        return <div>Error loading messages</div>
    }

    // Create conversations from messages
    const conversationsMap = new Map()
    messages.forEach(message => {
        const otherUser = message.sender_id === user.id ? message.receiver : message.sender
        const conversationKey = [message.sender_id, message.receiver_id].sort().join('-')
        
        if (!conversationsMap.has(conversationKey)) {
            conversationsMap.set(conversationKey, {
                user1_id: message.sender_id,
                user2_id: message.receiver_id,
                user1: message.sender,
                user2: message.receiver,
                last_message_at: message.created_at,
                messages: []
            })
        }
        conversationsMap.get(conversationKey).messages.push(message)
    })

    const conversations = Array.from(conversationsMap.values())

    return (
        <main className="min-h-screen bg-black text-gray-200 relative p-8"
            style={{ 
                backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/gvQ9NhQP8wbbM32jXy4V3j.jpg.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <Nav />
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <InboxClient 
                    initialConversations={conversations}
                    currentUser={user}
                />
            </div>
            <div className="absolute top-5 right-5">
                <SignOutButton/>
            </div>
        </main>
    )
}