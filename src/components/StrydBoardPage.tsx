import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'

const powerData = [
  { day: 'Lun', power: 245, rpe: 6 },
  { day: 'Mar', power: 280, rpe: 8 },
  { day: 'Mié', power: 255, rpe: 7 },
  { day: 'Jue', power: 310, rpe: 9 },
  { day: 'Vie', power: 240, rpe: 5 },
  { day: 'Sáb', power: 345, rpe: 10 },
  { day: 'Dom', power: 220, rpe: 4 },
]

export function StrydBoardPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
              <span className="text-white text-4xl font-black">S</span>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              StrydBoard
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Ingresa a tu ecosistema de potencia
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  title="Contraseña"
                  className="text-gray-300"
                >
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-orange-500/30"
              >
                Iniciar Sesión
              </Button>
            </form>
            <div className="mt-8 text-center">
              <a
                href="#"
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              DASH<span className="text-orange-500">BOARD</span>
            </h1>
            <p className="text-gray-400 font-medium">
              Bienvenido de vuelta, Ricardo Sanjur
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-6"
            >
              Exportar CSV
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6">
              Nuevo Entrenamiento
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: 'Critical Power',
              value: '285 W',
              delta: '+5',
              color: 'text-orange-500',
            },
            {
              label: 'RSS (7d)',
              value: '450',
              delta: '-12',
              color: 'text-blue-400',
            },
            {
              label: 'Leg Spring Stiffness',
              value: '9.2 kN/m',
              delta: '+0.2',
              color: 'text-purple-400',
            },
            {
              label: 'Efficiency Index',
              value: '1.45',
              delta: '+0.03',
              color: 'text-green-400',
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="bg-gray-900 border-gray-800 p-6 rounded-2xl"
            >
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                {stat.label}
              </p>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">
                  {stat.value}
                </span>
                <span
                  className={cn(
                    'text-xs font-bold',
                    stat.delta.startsWith('+')
                      ? 'text-green-500'
                      : 'text-red-500',
                  )}
                >
                  {stat.delta}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="power" className="space-y-8">
          <TabsList className="bg-gray-900 border border-gray-800 p-1.5 rounded-2xl w-full max-w-md">
            <TabsTrigger
              value="power"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Potencia Media
            </TabsTrigger>
            <TabsTrigger
              value="rpe"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Esfuerzo (RPE)
            </TabsTrigger>
            <TabsTrigger
              value="fatigue"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Fatiga Acumulada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="power">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden">
              <CardTitle className="mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                Análisis de Potencia Semanal
              </CardTitle>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={powerData}>
                    <defs>
                      <linearGradient
                        id="colorPower"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f2937"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                      }}
                      itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="power"
                      stroke="#f97316"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorPower)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rpe">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden">
              <CardTitle className="mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                Relación Esfuerzo Percibido
              </CardTitle>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={powerData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f2937"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                      }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="rpe" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardTitle className="mb-6">Próximos Objetivos</CardTitle>
            <div className="space-y-6">
              {[
                { title: 'Maratón de París', date: 'Abril 2026', progress: 65 },
                {
                  title: 'Ironman 70.3 Panama',
                  date: 'Febrero 2026',
                  progress: 88,
                },
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-orange-500">{goal.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-1000"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{goal.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardTitle className="mb-6">Insights de IA</CardTitle>
            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
              <p className="text-orange-200 leading-relaxed">
                "Basado en tus últimos entrenamientos de alta intensidad, tu
                fatiga muscular está aumentando. Se recomienda un día de
                recuperación activa mañana para optimizar tu CP el fin de
                semana."
              </p>
              <Button
                variant="link"
                className="text-orange-500 font-bold p-0 mt-4"
              >
                Ver análisis detallado →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
