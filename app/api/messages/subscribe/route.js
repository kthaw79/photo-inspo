import { createServerClient } from "@supabase/ssr"
import { cookies } from 'next/headers'

export async function GET(request) {
    const userId = request.nextUrl.searchParams.get('userId')
    
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

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

    // Subscribe to messages
    const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userId}`
        }, async (payload) => {
            // Get full message data with user info
            const { data: messages } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:user_profiles!sender_id(id, email),
                    receiver:user_profiles!receiver_id(id, email)
                `)
                .eq('id', payload.new.id)
                .single()

            writer.write(encoder.encode(`data: ${JSON.stringify(messages)}\n\n`))
        })
        .subscribe()

    return new Response(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
} 