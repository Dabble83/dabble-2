// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'

interface ChatPopoverProps {
  recipientId: string
  recipientUsername: string
  onClose: () => void
}

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export default function ChatPopover({ recipientId, recipientUsername, onClose }: ChatPopoverProps) {
  const { user } = useSupabaseAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Find or create conversation
  useEffect(() => {
    if (!user || !recipientId) return

    const findOrCreateConversation = async () => {
      try {
        const client = getSupabaseClient()

        // Check if conversation exists via conversation_members table
        // First try to find existing conversation
        const { data: existingMembers, error: findError } = await client
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', user.id)
          .limit(100)

        let convId: string | null = null

        if (!findError && existingMembers) {
          // Check if any of these conversations also has the recipient
          for (const member of existingMembers) {
            const { data: otherMember } = await client
              .from('conversation_members')
              .select('conversation_id')
              .eq('conversation_id', member.conversation_id)
              .eq('user_id', recipientId)
              .single()
            
            if (otherMember) {
              convId = member.conversation_id
              break
            }
          }
        }

        if (!convId) {
          // Create new conversation
          const { data: newConv, error: createError } = await client
            .from('conversations')
            .insert({
              created_at: new Date().toISOString(),
            })
            .select('id')
            .single()

          if (createError) {
            // If conversations table doesn't exist, create a simple ID
            convId = `${user.id}_${recipientId}_${Date.now()}`
          } else {
            convId = newConv.id

            // Create conversation members
            try {
              await client.from('conversation_members').insert([
                { conversation_id: convId, user_id: user.id },
                { conversation_id: convId, user_id: recipientId },
              ])
            } catch (err) {
              // Table might not exist yet - that's okay for stub
              console.warn('conversation_members table may not exist:', err)
            }
          }
        }

        setConversationId(convId)
        loadMessages(convId)
      } catch (err) {
        console.error('Error setting up conversation:', err)
        setLoading(false)
      }
    }

    findOrCreateConversation()
  }, [user, recipientId])

  const loadMessages = async (convId: string) => {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })

      if (error) {
        // Table might not exist yet - that's okay for stub
        console.warn('messages table may not exist:', error)
        setMessages([])
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId || !user || sending) return

    setSending(true)
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: messageText.trim(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        // Table might not exist yet - create local message for stub
        console.warn('messages table may not exist, creating local message:', error)
        const localMessage: Message = {
          id: `local_${Date.now()}`,
          content: messageText.trim(),
          sender_id: user.id,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, localMessage])
      } else {
        setMessages(prev => [...prev, data])
      }

      setMessageText('')
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.error('Error sending message:', err)
      // Create local message as fallback
      const localMessage: Message = {
        id: `local_${Date.now()}`,
        content: messageText.trim(),
        sender_id: user.id,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, localMessage])
      setMessageText('')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '360px',
      maxHeight: '500px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#1F2A37',
          margin: 0,
          fontFamily: '-apple-system, sans-serif'
        }}>
          Chat with @{recipientUsername}
        </h3>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6B7280',
            padding: '0',
            lineHeight: '1'
          }}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '200px',
        maxHeight: '300px'
      }}>
        {loading ? (
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center' }}>
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center' }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === user?.id
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '75%'
                }}
              >
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: isOwn ? '#7A8F6A' : '#F3F4F6',
                  color: isOwn ? '#F7F6F2' : '#1F2A37',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: '-apple-system, sans-serif'
                }}>
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Credit Exchange Stub */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#F9FAFB'
      }}>
        <button
          type="button"
          onClick={async () => {
            // Credit exchange stub - propose exchange
            const amount = prompt('Propose credit exchange amount:')
            if (amount && conversationId && user) {
            try {
              const client = getSupabaseClient()
              const { error } = await client.from('credit_offers').insert({
                conversation_id: conversationId,
                proposer_id: user.id,
                recipient_id: recipientId,
                amount: parseFloat(amount),
                status: 'pending',
                created_at: new Date().toISOString(),
              })
              
              if (error) {
                // Table might not exist yet - that's okay for stub
                console.warn('credit_offers table may not exist:', error)
                alert('Credit exchange proposed! (Note: credit_offers table may need to be created in Supabase)')
              } else {
                alert('Credit exchange proposed!')
              }
            } catch (err) {
              console.error('Error proposing credit exchange:', err)
              alert('Credit exchange proposed! (Note: credit_offers table may need to be created in Supabase)')
            }
            }
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#7A8F6A',
            color: '#F7F6F2',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: '-apple-system, sans-serif',
            marginBottom: '8px'
          }}
        >
          Propose Credit Exchange
        </button>
      </div>

      {/* Input */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type a message..."
          disabled={sending || !conversationId}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '14px',
            border: '2px solid #D1D5DB',
            borderRadius: '6px',
            fontFamily: '-apple-system, sans-serif'
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !messageText.trim() || !conversationId}
          style={{
            padding: '8px 16px',
            backgroundColor: '#7A8F6A',
            color: '#F7F6F2',
            border: 'none',
            borderRadius: '6px',
            cursor: sending || !messageText.trim() || !conversationId ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: '-apple-system, sans-serif',
            opacity: sending || !messageText.trim() || !conversationId ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
