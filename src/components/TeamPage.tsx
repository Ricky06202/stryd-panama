import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { useState } from 'react'
import { Trophy, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Athlete {
  id: number
  name: string
  image: string
  distance: string
  achievement: string
  cp: string
  category: '5k' | '10k' | '21k' | '42k' | 'ultra'
}

interface TeamPageProps {
  initialAthletes?: Athlete[]
}

export function TeamPage({ initialAthletes = [] }: TeamPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos')

  const athletes = initialAthletes

  const filters = [
    { value: 'todos', label: 'Todos' },
    { value: '5k', label: '5K' },
    { value: '10k', label: '10K' },
    { value: '21k', label: '21K' },
    { value: '42k', label: '42K' },
    { value: 'ultra', label: 'Ultra' },
  ]

  const filteredAthletes =
    selectedFilter === 'todos'
      ? athletes
      : athletes.filter((athlete) => athlete.category === selectedFilter)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Team StrydPanama</h1>
            <p className="text-xl text-orange-100 italic">
              Corredores apasionados unidos por el entrenamiento inteligente
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white/80 top-[80px] z-50 border-b border-gray-100 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                variant={
                  selectedFilter === filter.value ? 'default' : 'outline'
                }
                className={
                  selectedFilter === filter.value
                    ? 'bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 border-none shadow-md'
                    : 'text-gray-600 border-gray-300 hover:bg-white'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Athletes Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAthletes.map((athlete) => (
              <Card
                key={athlete.id}
                className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={athlete.image}
                      alt={athlete.name}
                      className="w-full h-72 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-extrabold shadow-lg">
                      {athlete.distance}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-500 transition-colors">
                      {athlete.name}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Trophy className="h-4 w-4 text-orange-500 shrink-0" />
                        <span className="font-medium">
                          {athlete.achievement}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Target className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>
                          CP Actual:{' '}
                          <span className="font-bold text-gray-900">
                            {athlete.cp}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAthletes.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-xl font-medium">
                No se encontraron atletas en la categoría{' '}
                <span className="font-bold text-black">"{selectedFilter}"</span>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6 text-black">
            ¿Quieres Ser Parte del Team?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Únete a nuestra comunidad de corredores que entrenan con ciencia,
            datos precisos y una pasión compartida por el running.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/unete">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-7 text-lg shadow-xl shadow-orange-500/20"
              >
                Solicitar Información
              </Button>
            </a>
            <a href="/calendario">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-900 border-2 text-black hover:bg-gray-900 hover:text-white font-bold px-10 py-7 text-lg transition-all"
              >
                Ver Calendario de Entrenos
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
