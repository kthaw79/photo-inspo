'use server'

import { cookies } from 'next/headers'
import { createServerClient } from "@supabase/ssr"

async function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(
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
}

export async function sendMessageAndRefresh(currentUserId, selectedConversation, newMessage) {
  const supabase = await getSupabase()
  
  try {
    // First send the new message
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: currentUserId === selectedConversation.user1_id 
          ? selectedConversation.user2_id 
          : selectedConversation.user1_id,
        content: newMessage.trim()
      })

    if (error) throw error

    // Get only messages for this specific conversation
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles!sender_id(id, email),
        receiver:user_profiles!receiver_id(id, email)
      `)
      .or(
        `and(sender_id.eq.${selectedConversation.user1_id},receiver_id.eq.${selectedConversation.user2_id}),` +
        `and(sender_id.eq.${selectedConversation.user2_id},receiver_id.eq.${selectedConversation.user1_id})`
      )
      .order('created_at', { ascending: true })

    if (fetchError) throw fetchError
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
} 