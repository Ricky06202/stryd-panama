import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Lock,
  Globe,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  type:
    | 'entreno'
    | 'competencia'
    | 'social'
    | 'cumpleaños'
    | 'longrun'
    | 'clase'
  description: string
  cost: string
  classification: 'public' | 'team'
  gpxUrl?: string
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        // Normalize dates to YYYY-MM-DD string using UTC to avoid timezone shifts
        const normalizedEvents = (data as any[]).map((e) => {
          const d = new Date(e.date)
          const year = d.getUTCFullYear()
          const month = (d.getUTCMonth() + 1).toString().padStart(2, '0')
          const day = d.getUTCDate().toString().padStart(2, '0')
          return {
            ...e,
            date: `${year}-${month}-${day}`,
          }
        })
        setEvents(normalizedEvents as Event[])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching events:', err)
        setLoading(false)
      })
  }, [])
  const getTypeBadgeColor = (type: Event['type']) => {
    switch (type) {
      case 'entreno':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'competencia':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'social':
        return 'bg-green-500 hover:bg-green-600'
      case 'cumpleaños':
        return 'bg-pink-500 hover:bg-pink-600'
      case 'longrun':
        return 'bg-violet-500 hover:bg-violet-600'
      case 'clase':
        return 'bg-teal-500 hover:bg-teal-600'
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
      case 'cumpleaños':
        return 'border-l-pink-500'
      case 'longrun':
        return 'border-l-violet-500'
      case 'clase':
        return 'border-l-teal-500'
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
      case 'cumpleaños':
        return 'Cumpleaños'
      case 'longrun':
        return 'Long Run'
      case 'clase':
        return 'Running Class'
      default:
        return type
    }
  }

  const getTypeColorValue = (type: Event['type']) => {
    switch (type) {
      case 'entreno':
        return 'rgb(59, 130, 246)' // blue-500
      case 'competencia':
        return 'rgb(249, 115, 22)' // orange-500
      case 'social':
        return 'rgb(34, 197, 94)' // green-500
      case 'cumpleaños':
        return 'rgb(236, 72, 153)' // pink-500
      case 'longrun':
        return 'rgb(139, 92, 246)' // violet-500
      case 'clase':
        return 'rgb(20, 184, 166)' // teal-500
      default:
        return 'rgb(107, 114, 128)' // gray-500
    }
  }

  // --- Helper for Local Date String (YYYY-MM-DD) ---
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDate = (dateString: string) => {
    // Append T12:00:00 to avoid timezone shifts when parsing YYYY-MM-DD
    // or simply split and format manually to be 100% safe
    const parts = dateString.split('-')
    const date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    )

    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  // --- Calendar Logic ---

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust for Monday start if needed.
    // Let's assume standard Sunday start for simplicity or adjust to Monday (1)
    // The reference image shows "Lun" as first column, so Monday start.
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Shift: Sun(0)->6, Mon(1)->0
  }

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  )
  const firstDayOfWeek = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  )

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDaysArray = Array.from({ length: firstDayOfWeek }, (_, i) => i)

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }

  // Filter events for the list (show events from selectedDate onwards)
  const selectedDateStr = getLocalDateString(selectedDate)

  // 1. Events for the specific selected day
  const selectedDayEvents = events.filter((e) => e.date === selectedDateStr)

  // 2. Future events (after the selected day)
  const futureEvents = events
    .filter((e) => e.date > selectedDateStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Get events for specific days to render on grid
  const getEventsForDay = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() // 0-indexed
    // Pad month and day for string comparison "YYYY-MM-DD"
    const monthStr = (month + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    const dateStr = `${year}-${monthStr}-${dayStr}`

    return events.filter((e) => e.date === dateStr)
  }

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
    setSelectedDate(newDate)
  }

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const EventCard = ({ event }: { event: Event }) => (
    <Card
      className={cn(
        'border-l-4 hover:shadow-lg transition-shadow bg-white border-t border-r border-b border-gray-100',
        getTypeBorderColor(event.type),
      )}
    >
      <CardHeader className="pb-3 text-black">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
          <div className="flex gap-2">
            <Badge
              className={cn(
                getTypeBadgeColor(event.type),
                'text-white w-fit border-none font-semibold',
              )}
            >
              {getTypeLabel(event.type)}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'w-fit border-gray-300 font-medium flex items-center gap-1',
                event.classification === 'team'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-green-50 text-green-900 border-green-200',
              )}
            >
              {event.classification === 'team' ? (
                <>
                  <Lock className="w-3 h-3" /> Exclusivo Team
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" /> Todo Público
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="capitalize text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold text-gray-900 text-sm">Costo:</span>
            <span className="text-sm">{event.cost}</span>
          </div>
          {event.gpxUrl && (
            <a
              href={event.gpxUrl}
              download
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Descargar Ruta (GPX)</span>
            </a>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed">{event.description}</p>
      </CardContent>
    </Card>
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
              Entrenos grupales, competencias y eventos sociales
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Calendar Grid */}
            <div className="lg:col-span-5 space-y-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-xs border border-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="hover:bg-gray-100 text-gray-700"
                >
                  <span className="text-xl">{'<'}</span>
                </Button>
                <h2 className="text-xl font-bold text-gray-800">
                  {monthNames[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  className="hover:bg-gray-100 text-gray-700"
                >
                  <span className="text-xl">{'>'}</span>
                </Button>
              </div>

              {/* Legend (Compact) */}
              <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Entreno
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Competencia
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Social
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>Cumple
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>Long
                  Run
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>Clase
                </div>
              </div>

              {/* Grid */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4">
                <div className="grid grid-cols-7 mb-2 text-center">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-xs font-semibold text-gray-400 py-2 uppercase tracking-wide"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {emptyDaysArray.map((i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}
                  {daysArray.map((day) => {
                    const daysEvents = getEventsForDay(day)
                    const selected = isSelected(day)
                    const isCurrentDay = isToday(day)

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={cn(
                          'relative aspect-square flex flex-col items-center justify-start py-2 rounded-lg transition-all',
                          selected
                            ? 'bg-orange-50 box-border border-2 border-orange-500 shadow-sm'
                            : 'hover:bg-gray-50 border border-transparent',
                          isCurrentDay && !selected && 'bg-gray-50 font-bold',
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm',
                            selected
                              ? 'font-bold text-orange-700'
                              : 'text-gray-700',
                            isCurrentDay && !selected && 'text-orange-600',
                          )}
                        >
                          {day}
                        </span>

                        {/* Event Dots/Bars */}
                        <div className="flex flex-wrap gap-1 justify-center mt-1 px-1 w-full">
                          {daysEvents.map((event) => (
                            <div
                              key={event.id}
                              className="h-1.5 w-full rounded-full"
                              style={{
                                backgroundColor: getTypeColorValue(event.type),
                              }}
                              title={event.title}
                            />
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Event Lists */}
            <div className="lg:col-span-7 space-y-8">
              {/* Selected Day Events */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                  Eventos del {formatDate(selectedDateStr)}
                </h3>

                <div className="space-y-4">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 italic">
                        No hay actividades programadas para este día.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Future Events */}
              <div>
                <h3 className="text-lg font-bold text-gray-500 mb-4 px-2 uppercase tracking-wide">
                  Próximamente
                </h3>

                <div className="space-y-4 opacity-90">
                  {futureEvents.length > 0 ? (
                    futureEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm px-2">
                      No hay más eventos programados este mes.
                    </p>
                  )}
                </div>
              </div>
            </div>
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
          <a href="/unete">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-orange-500/30"
            >
              Únete al Team StrydPanama
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
