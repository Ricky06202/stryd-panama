import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Race {
  id: string
  name: string
  date: string
  location: string
  distances: string[]
  description: string
  image: string
  status: 'upcoming' | 'registration-open' | 'completed'
  participants?: number
  maxParticipants?: number
  registrationFee?: string
  highlights: string[]
  infoUrl?: string
  registrationUrl?: string
}

const races: Race[] = [
  {
    id: 'san-silvestre-2026',
    name: 'San Silvestre David 2026',
    date: '31 de diciembre, 2026',
    location: 'David, Chiriquí',
    distances: ['5K', '10K'],
    description:
      '¡Despide el año corriendo! Únete a la tradicional carrera San Silvestre, donde celebramos el cierre del año con energía, comunidad y mucho running. Una experiencia única que combina deporte, diversión y compañerismo.',
    image: 'running celebration night',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 500,
    registrationFee: '$15 - $25',
    highlights: [
      'Medalla finisher para todos los participantes',
      'Playera oficial (Opcional)',
      'Hidratación en ruta y meta',
      'Premios',
      'Fiesta post-carrera',
      'Cronometraje',
    ],
    infoUrl: 'https://sansilvestre.ricardosanjur.com/',
    registrationUrl: 'https://sansilvestre.ricardosanjur.com/inscripcion',
  },
  {
    id: 'san-silvestre-2025',
    name: 'San Silvestre David 2025',
    date: '31 de diciembre, 2025',
    location: 'David, Chiriquí',
    distances: ['5K', '10K'],
    description:
      'Primera edición exitosa de la San Silvestre en David. Más de 300 corredores disfrutaron de una noche mágica cerrando el año con energía positiva.',
    image: 'running finish line celebration',
    status: 'completed',
    participants: 320,
    highlights: [
      'Más de 300 corredores participaron',
      'Ambiente festivo y familiar',
      'Recorrido por las principales calles de David',
      'Gran aceptación de la comunidad',
    ],
  },
]

export function RacesPage() {
  const upcomingRaces = races.filter(
    (r) => r.status === 'upcoming' || r.status === 'registration-open',
  )
  const pastRaces = races.filter((r) => r.status === 'completed')

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-red-500/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)',
            }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Nuestras <span className="text-orange-500">Carreras</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Organizamos eventos que unen a la comunidad runner de Panamá.
            Carreras diseñadas con pasión, profesionalismo y el espíritu Stryd.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-gray-800/50">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-400"
              >
                Próximas Carreras
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-400"
              >
                Ediciones Anteriores
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Races */}
            <TabsContent value="upcoming" className="space-y-8 outline-none">
              {upcomingRaces.length > 0 ? (
                upcomingRaces.map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Próximamente anunciaremos nuevas carreras. ¡Stay tuned!
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Past Races */}
            <TabsContent value="past" className="space-y-8 outline-none">
              {pastRaces.length > 0 ? (
                pastRaces.map((race) => <RaceCard key={race.id} race={race} />)
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Aún no hay carreras completadas.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Run With Us Section */}
      <section className="py-16 px-4 bg-linear-to-r from-orange-500/10 to-red-500/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            ¿Por qué correr nuestras carreras?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-orange-500 mb-4" />
                <CardTitle className="text-white">
                  Organización Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Experiencia de equipo de running con atención a cada detalle:
                cronometraje preciso, hidratación adecuada, y seguridad
                garantizada.
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <Users className="w-12 h-12 text-orange-500 mb-4" />
                <CardTitle className="text-white">Comunidad Vibrante</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Más que una carrera, es una celebración. Conoce runners
                apasionados, comparte experiencias y forma parte de algo
                especial.
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <Trophy className="w-12 h-12 text-orange-500 mb-4" />
                <CardTitle className="text-white">
                  Experiencia Memorable
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Recorridos diseñados cuidadosamente, ambiente festivo, y premios
                que reconocen tu esfuerzo y dedicación.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 shadow-xl shadow-orange-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              ¿Quieres organizar un evento con nosotros?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Ponemos nuestra experiencia y pasión al servicio de tu evento
              deportivo.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-500 hover:bg-gray-100 font-bold text-base md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto h-auto whitespace-normal"
              onClick={() =>
                window.open(
                  'https://wa.me/50766769050?text=Hola, me interesa organizar un evento con StrydPanama',
                  '_blank',
                )
              }
            >
              Contáctanos por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function RaceCard({ race }: { race: Race }) {
  const isCompleted = race.status === 'completed'

  return (
    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-orange-500 transition-all duration-300">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image Section */}
        <div className="md:col-span-1 relative h-64 md:h-auto bg-linear-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <Trophy className="w-24 h-24 text-orange-500/30" />
          {race.status === 'registration-open' && (
            <Badge className="absolute top-4 right-4 bg-green-500 text-white border-none">
              Inscripciones Abiertas
            </Badge>
          )}
          {isCompleted && (
            <Badge className="absolute top-4 right-4 bg-gray-600 text-white border-none">
              Completada
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="md:col-span-2 p-8 text-white">
          <div className="flex flex-wrap gap-2 mb-4 text-black">
            {race.distances.map((distance) => (
              <Badge
                key={distance}
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                {distance}
              </Badge>
            ))}
          </div>

          <h3 className="text-3xl font-bold text-white mb-4">{race.name}</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span>{race.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>{race.location}</span>
            </div>
            {!isCompleted && race.registrationFee && (
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <span>{race.registrationFee}</span>
              </div>
            )}
            {race.participants !== undefined && (
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-orange-500" />
                <span>
                  {race.participants}
                  {race.maxParticipants && !isCompleted
                    ? ` / ${race.maxParticipants}`
                    : ''}
                  {isCompleted ? ' participantes' : ' inscritos'}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {race.description}
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              {isCompleted ? 'Highlights:' : 'Incluye:'}
            </h4>
            <ul className="grid md:grid-cols-2 gap-2">
              {race.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                onClick={() =>
                  window.open(
                    race.registrationUrl ||
                      'https://wa.me/50769001234?text=Hola, quiero inscribirme en ' +
                        race.name,
                    '_blank',
                  )
                }
              >
                Inscríbete Ahora
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() =>
                  window.open(
                    race.infoUrl ||
                      'https://wa.me/50769001234?text=Hola, quiero más información sobre ' +
                        race.name,
                    '_blank',
                  )
                }
              >
                Más Información
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
