import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PerformanceChart } from '@/components/PerformanceChart'
import { Loader2, Users, Settings, BarChart2 } from 'lucide-react'

interface Athlete {
  id: number
  fullName: string
  email: string
  stravaConnected: boolean
}

export function CoachingPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
    null,
  )
  const [metrics, setMetrics] = useState<any[]>([])
  const [ftp, setFtp] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)

  useEffect(() => {
    fetchAthletes()
  }, [])

  const fetchAthletes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/athletes')
      if (response.ok) {
        const data = await response.json()
        setAthletes(data.athletes)
      }
    } catch (error) {
      console.error('Error fetching athletes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAthleteMetrics = async (userId: number) => {
    setSelectedAthleteId(userId)
    setIsLoadingMetrics(true)
    try {
      const response = await fetch(`/api/strava/metrics?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setFtp(data.ftp)
      } else {
        setMetrics([])
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setMetrics([])
    } finally {
      setIsLoadingMetrics(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Panel de <span className="text-blue-500">Coaching</span>
          </h2>
          <p className="text-gray-400">
            Administra el rendimiento de tus atletas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lista de Atletas */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gray-900 border-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                ATLETAS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : athletes.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm italic">
                  No hay atletas registrados.
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {athletes.map((athlete) => (
                    <button
                      key={athlete.id}
                      onClick={() => fetchAthleteMetrics(athlete.id)}
                      className={`w-full text-left p-4 transition-all hover:bg-gray-800 flex items-center justify-between ${
                        selectedAthleteId === athlete.id
                          ? 'bg-gray-800 border-l-4 border-l-blue-500'
                          : ''
                      }`}
                    >
                      <div>
                        <p className="font-bold text-white text-sm">
                          {athlete.fullName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                          {athlete.email}
                        </p>
                      </div>
                      {athlete.stravaConnected && (
                        <div
                          className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20"
                          title="Strava Conectado"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalle y Gráfico */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedAthleteId ? (
            <Card className="bg-gray-900 border-gray-800 h-[600px] flex items-center justify-center p-12 text-center rounded-3xl border-dashed">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Selecciona un atleta
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Haz clic en un atleta de la lista para analizar su carga de
                  entrenamiento y métricas de rendimiento.
                </p>
              </div>
            </Card>
          ) : isLoadingMetrics ? (
            <Card className="bg-gray-900 border-gray-800 h-[600px] flex items-center justify-center rounded-3xl">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </Card>
          ) : metrics.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 h-[600px] flex items-center justify-center rounded-3xl p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Sin datos disponibles
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Este atleta aún no ha conectado su cuenta de Strava o no tiene
                  actividades recientes para calcular el rendimiento.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white uppercase italic">
                  Rendimiento:{' '}
                  <span className="text-blue-500">
                    {athletes.find((a) => a.id === selectedAthleteId)?.fullName}
                  </span>
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      FTP Actual
                    </span>
                    <span className="text-orange-500 font-black">
                      {ftp || 'N/A'}W
                    </span>
                  </div>
                </div>
              </div>
              <PerformanceChart data={metrics} ftp={ftp} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
