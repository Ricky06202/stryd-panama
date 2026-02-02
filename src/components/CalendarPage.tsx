import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  type: 'entreno' | 'competencia' | 'social'
  description: string
  participants?: number
}

export function CalendarPage() {
  const events: Event[] = [
    {
      id: 1,
      title: 'Entreno Grupal - Intervalos',
      date: '2026-02-03',
      time: '5:30 AM',
      location: 'Parque Omar, David',
      type: 'entreno',
      description:
        'Sesión de intervalos 6x800m a potencia crítica. Trae tu Stryd configurado.',
      participants: 12,
    },
    {
      id: 2,
      title: 'Carrera 10K Ciudad de David',
      date: '2026-02-08',
      time: '6:00 AM',
      location: 'Centro de David',
      type: 'competencia',
      description:
        'Evento local de 10K. Prueba tus zonas de potencia en competencia.',
    },
    {
      id: 3,
      title: 'Rodaje Largo Grupal',
      date: '2026-02-10',
      time: '5:00 AM',
      location: 'Ruta Boquete',
      type: 'entreno',
      description:
        'Rodaje progresivo 25K. Ritmo conversacional subiendo potencia final 5K.',
      participants: 15,
    },
    {
      id: 4,
      title: 'Café Post-Entreno',
      date: '2026-02-10',
      time: '8:00 AM',
      location: 'Café Ruiz, Boquete',
      type: 'social',
      description:
        'Reunión social después del rodaje largo. Análisis de datos Stryd.',
      participants: 15,
    },
    {
      id: 5,
      title: 'Entreno Técnico - Subidas',
      date: '2026-02-12',
      time: '5:30 AM',
      location: 'Alto Boquete',
      type: 'entreno',
      description: 'Trabajo de fuerza en subidas controlando potencia. 8x3min.',
      participants: 10,
    },
    {
      id: 6,
      title: 'Media Maratón Volcán',
      date: '2026-02-15',
      time: '7:00 AM',
      location: 'Volcán, Chiriquí',
      type: 'competencia',
      description:
        '21K con desnivel. Perfecto para aplicar gestión de potencia en terreno mixto.',
    },
    {
      id: 7,
      title: 'Entreno Grupal - Tempo',
      date: '2026-02-17',
      time: '5:30 AM',
      location: 'Parque Omar, David',
      type: 'entreno',
      description:
        'Tempo run 40min a zona 3 de potencia. Calentamiento y enfriamiento incluidos.',
      participants: 14,
    },
    {
      id: 8,
      title: 'Charla: Nutrición para Runners',
      date: '2026-02-20',
      time: '7:00 PM',
      location: 'Sede StrydPanama',
      type: 'social',
      description:
        'Nutricionista invitada habla sobre estrategias de alimentación para rendimiento.',
      participants: 20,
    },
    {
      id: 9,
      title: 'Entreno Grupal - Fartlek',
      date: '2026-02-24',
      time: '5:30 AM',
      location: 'Parque Omar, David',
      type: 'entreno',
      description:
        'Fartlek guiado por potencia. Variaciones de intensidad basadas en CP.',
      participants: 11,
    },
    {
      id: 10,
      title: 'Maratón de Panamá',
      date: '2026-02-28',
      time: '5:00 AM',
      location: 'Ciudad de Panamá',
      type: 'competencia',
      description:
        'Maratón oficial. ¡El team completo estará presente! Pacing por potencia.',
    },
  ]

  const getTypeBadgeColor = (type: Event['type']) => {
    switch (type) {
      case 'entreno':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'competencia':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'social':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getTypeBorderColor = (type: Event['type']) => {
    switch (type) {
      case 'entreno':
        return 'border-l-blue-500'
      case 'competencia':
        return 'border-l-orange-500'
      case 'social':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const getTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'entreno':
        return 'Entreno Grupal'
      case 'competencia':
        return 'Competencia'
      case 'social':
        return 'Evento Social'
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  const groupedEvents = events.reduce(
    (acc, event) => {
      const date = new Date(event.date)
      const day = date.getDate()
      const week = Math.floor((day - 1) / 7)
      if (!acc[week]) acc[week] = []
      acc[week].push(event)
      return acc
    },
    {} as Record<number, Event[]>,
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-orange-500" />
            <h1 className="text-5xl font-bold mb-4">
              Calendario de Actividades
            </h1>
            <p className="text-xl text-gray-300">
              Entrenos grupales, competencias y eventos sociales - Febrero 2026
            </p>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Entrenos Grupales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-700">Competencias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Eventos Sociales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Events */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {Object.keys(groupedEvents)
              .sort()
              .map((week) => (
                <div key={week}>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                    Semana {parseInt(week) + 1}
                  </h2>
                  <div className="space-y-4">
                    {groupedEvents[parseInt(week)]
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((event) => (
                        <Card
                          key={event.id}
                          className={cn(
                            'border-l-4 hover:shadow-lg transition-shadow bg-white border-t border-r border-b border-gray-100',
                            getTypeBorderColor(event.type),
                          )}
                        >
                          <CardHeader className="pb-3 text-black">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <CardTitle className="text-xl font-bold">
                                {event.title}
                              </CardTitle>
                              <Badge
                                className={cn(
                                  getTypeBadgeColor(event.type),
                                  'text-white w-fit border-none font-semibold',
                                )}
                              >
                                {getTypeLabel(event.type)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span className="capitalize text-sm">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span className="text-sm">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                <span className="text-sm">
                                  {event.location}
                                </span>
                              </div>
                              {event.participants && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Users className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm">
                                    {event.participants} confirmados
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {event.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            ¿Quieres Unirte a los Entrenos?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Todos los miembros del team tienen acceso completo al calendario y
            eventos exclusivos
          </p>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-orange-500/30"
          >
            Únete al Team StrydPanama
          </Button>
        </div>
      </section>
    </div>
  )
}
