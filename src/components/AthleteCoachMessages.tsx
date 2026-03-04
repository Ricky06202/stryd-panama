import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare, Plus } from 'lucide-react'

interface CoachMessage {
  id: number
  userId: number
  content: string
  createdAt: number | string
}

interface Props {
  athleteId: number | null
}

export function AthleteCoachMessages({ athleteId }: Props) {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchMessages = async () => {
    if (!athleteId) return
    try {
      const response = await fetch(
        `/api/coach/messages/list?userId=${athleteId}`,
      )
      if (response.ok) {
        const data = (await response.json()) as {
          coachMessages: CoachMessage[]
        }
        setMessages(data.coachMessages)
      }
    } catch (error) {
      console.error('Error fetching coach messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [athleteId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!athleteId || !content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/coach/messages/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: athleteId, content }),
      })

      if (response.ok) {
        const data = (await response.json()) as { coachMessage: CoachMessage }
        setMessages([data.coachMessage, ...messages])
        setContent('')
      }
    } catch (error) {
      console.error('Error adding coach message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!athleteId) return null

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Enviar Mensaje al Atleta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe un mensaje, recomendación o instrucción para el atleta..."
              className="w-full min-h-24 bg-muted border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Publicar Mensaje
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Historial de Mensajes</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground italic py-4">
            No hay mensajes previos.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 bg-muted/50 border border-border rounded-lg"
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-2 text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    {(() => {
                      if (!msg.createdAt) return 'Fecha desconocida'
                      let date = new Date(msg.createdAt)
                      if (isNaN(date.getTime())) {
                        const ts = Number(msg.createdAt)
                        if (!isNaN(ts)) {
                          date = new Date(ts * (ts < 10000000000 ? 1000 : 1))
                        }
                      }
                      return isNaN(date.getTime())
                        ? 'Fecha desconocida'
                        : date.toLocaleString('es-PA', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
