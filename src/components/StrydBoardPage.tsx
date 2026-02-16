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
  const [view, setView] = useState<'landing' | 'profile' | 'performance'>(
    'landing',
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Expanded profile state to match Admin UI
  const [profile, setProfile] = useState({
    fullName: '',
    idCard: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    province: '',
    photoUrl: '',

    // Salud
    bloodType: '',
    allergies: '',
    diseases: '',
    pastInjuries: '',
    currentInjuries: '',

    // Biometría
    height: '',
    weight: '',
    fatPercentage: '',
    footwearType: '',

    // Records
    record5k: '',
    record10k: '',
    record21k: '',
    record42k: '',
    recordWkg: '',
    strydUser: '',
    finalSurgeUser: '',
  })

  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as any

      if (!response.ok) {
        setLoginError(data.error || 'Error al iniciar sesión')
        return
      }

      // Populate profile with real data
      setProfile({
        fullName: data.fullName || '',
        idCard: data.idCard || '',
        email: data.email || '',
        phone: data.phone || '',
        birthDate: data.birthDate || '',
        gender: data.gender || '',
        province: data.province || '',
        photoUrl: data.photoUrl || '',

        // Salud
        bloodType: data.bloodType || '',
        allergies: data.allergies || '',
        diseases: data.diseases || '',
        pastInjuries: data.pastInjuries || '',
        currentInjuries: data.currentInjuries || '',

        // Biometría (convert numbers to strings for inputs)
        height: data.height ? String(data.height) : '',
        weight: data.weight ? String(data.weight) : '',
        fatPercentage: data.fatPercentage ? String(data.fatPercentage) : '',
        footwearType: data.footwearType || '',

        // Records
        record5k: data.record5k || '',
        record10k: data.record10k || '',
        record21k: data.record21k || '',
        record42k: data.record42k || '',
        recordWkg: data.recordWkg || '',
        strydUser: data.strydUser || '',
        finalSurgeUser: data.finalSurgeUser || '',
      })

      setCurrentUserId(data.id)
      setIsLoggedIn(true)
      setView('landing')
    } catch (error) {
      setLoginError('Error de conexión')
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          ...profile,
        }),
      })

      if (response.ok) {
        setSaveMessage('Perfil actualizado con éxito')
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage('Error al actualizar el perfil')
      }
    } catch (error) {
      setSaveMessage('Error de conexión')
    } finally {
      setIsSaving(false)
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
              {loginError && (
                <div className="text-red-500 text-sm font-bold text-center bg-red-500/10 p-2 rounded-lg">
                  {loginError}
                </div>
              )}
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

  // --- VISTA DE ATERRIZAJE (LANDING) ---
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => setView('profile')}
            className="group relative bg-gray-900 border border-gray-800 p-12 rounded-3xl text-center transition-all hover:bg-gray-800 hover:border-orange-500/50 hover:scale-[1.02]"
          >
            <div className="w-24 h-24 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-500 group-hover:text-white text-orange-500 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-4">
              MI <span className="text-orange-500">PERFIL</span>
            </h2>
            <p className="text-gray-400 font-medium">
              Gestiona tus datos personales, médicos y records.
            </p>
          </button>

          <button
            onClick={() => setView('performance')}
            className="group relative bg-gray-900 border border-gray-800 p-12 rounded-3xl text-center transition-all hover:bg-gray-800 hover:border-blue-500/50 hover:scale-[1.02]"
          >
            <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-500 group-hover:text-white text-blue-500 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-4">
              MI <span className="text-blue-500">PERFORMANCE</span>
            </h2>
            <p className="text-gray-400 font-medium">
              Analiza tu potencia, fatiga y progreso semanal.
            </p>
          </button>
        </div>
      </div>
    )
  }

  // --- VISTA DE PERFIL (SIMILAR A ADMIN) ---
  if (view === 'profile') {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setView('landing')}
            className="text-orange-500 hover:underline flex items-center gap-2 mb-8 font-bold"
          >
            ← Volver al inicio
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                MI <span className="text-orange-500">PERFIL</span>
              </h1>
              <p className="text-gray-400 font-medium">
                Gestiona tu información de atleta
              </p>
            </div>
            {saveMessage && (
              <div
                className={cn(
                  'px-6 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 shadow-lg',
                  saveMessage.includes('Error')
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white',
                )}
              >
                {saveMessage}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Columna Izquierda: Foto e Info Básica */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl text-center">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-orange-500/20 overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-black mb-1">{profile.fullName}</h2>
                <p className="text-gray-500 text-sm mb-8">{profile.email}</p>

                <div className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Nombre Completo
                    </Label>
                    <Input
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Cédula / ID
                    </Label>
                    <Input
                      value={profile.idCard}
                      onChange={(e) =>
                        setProfile({ ...profile, idCard: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Teléfono
                    </Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-500 italic font-black">
                    🏆
                  </span>
                  Records Personales
                </h3>
                <div className="space-y-4">
                  {[
                    { label: '5K', key: 'record5k', placeholder: '00:00' },
                    { label: '10K', key: 'record10k', placeholder: '00:00' },
                    { label: '21K', key: 'record21k', placeholder: '00:00:00' },
                    { label: '42K', key: 'record42k', placeholder: '00:00:00' },
                  ].map((rec) => (
                    <div
                      key={rec.key}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl border border-gray-800"
                    >
                      <span className="font-bold text-gray-400 text-sm">
                        {rec.label}
                      </span>
                      <Input
                        placeholder={rec.placeholder}
                        value={(profile as any)[rec.key]}
                        onChange={(e) =>
                          setProfile({ ...profile, [rec.key]: e.target.value })
                        }
                        className="w-24 bg-transparent border-none text-right text-orange-500 font-black focus:ring-0 p-0"
                      />
                    </div>
                  ))}
                  <div className="pt-4">
                    <Label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">
                      Record W/kg
                    </Label>
                    <Input
                      placeholder="0.0"
                      value={profile.recordWkg}
                      onChange={(e) =>
                        setProfile({ ...profile, recordWkg: e.target.value })
                      }
                      className="text-3xl font-black bg-transparent border-none p-0 text-orange-500 focus:ring-0 h-auto"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Columna Central: Salud y Biometría */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-red-500/10 rounded-lg">🏥</span>
                  Ficha Médica
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Tipo de Sangre
                    </Label>
                    <Input
                      value={profile.bloodType}
                      onChange={(e) =>
                        setProfile({ ...profile, bloodType: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Alergias
                    </Label>
                    <Input
                      value={profile.allergies}
                      onChange={(e) =>
                        setProfile({ ...profile, allergies: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Lesiones Actuales
                    </Label>
                    <textarea
                      value={profile.currentInjuries}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          currentInjuries: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px]"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-500/10 rounded-lg">📏</span>
                  Biometría
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Estatura (cm)
                    </Label>
                    <Input
                      value={profile.height}
                      onChange={(e) =>
                        setProfile({ ...profile, height: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Peso (kg)
                    </Label>
                    <Input
                      value={profile.weight}
                      onChange={(e) =>
                        setProfile({ ...profile, weight: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      % Grasa
                    </Label>
                    <Input
                      value={profile.fatPercentage}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          fatPercentage: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Tipo de Pisada
                    </Label>
                    <Input
                      value={profile.footwearType}
                      onChange={(e) =>
                        setProfile({ ...profile, footwearType: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Columna Derecha: Plataformas y Acción */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-purple-500/10 rounded-lg font-black italic">
                    🔗
                  </span>
                  Plataformas
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Usuario Stryd
                    </Label>
                    <div className="flex gap-3 p-3 bg-gray-800/50 rounded-2xl border border-gray-800">
                      <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-orange-500/20">
                        S
                      </div>
                      <Input
                        value={profile.strydUser}
                        onChange={(e) =>
                          setProfile({ ...profile, strydUser: e.target.value })
                        }
                        className="bg-transparent border-none text-white focus:ring-0 p-0 h-10"
                        placeholder="Vincular Stryd"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      Usuario Final Surge
                    </Label>
                    <div className="flex gap-3 p-3 bg-gray-800/50 rounded-2xl border border-gray-800">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-500/20">
                        FS
                      </div>
                      <Input
                        value={profile.finalSurgeUser}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            finalSurgeUser: e.target.value,
                          })
                        }
                        className="bg-transparent border-none text-white focus:ring-0 p-0 h-10"
                        placeholder="Vincular Final Surge"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-8 rounded-3xl transition-all shadow-xl shadow-orange-500/30 text-xl disabled:opacity-50"
                >
                  {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </Button>
                <p className="text-center text-gray-500 text-xs mt-4 font-medium uppercase tracking-widest italic">
                  Tus datos se sincronizan con el panel de coach
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // --- VISTA DE PERFORMANCE (MÉTRICAS ACTUALES) ---
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => setView('landing')}
              className="text-blue-500 hover:underline flex items-center gap-2 mb-4 font-bold"
            >
              ← Volver al inicio
            </button>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              MI <span className="text-blue-500">PERFORMANCE</span>
            </h1>
            <p className="text-gray-400 font-medium">
              Ricardo Sanjur • Análisis de entrenamiento
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-6"
            >
              Exportar CSV
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-6 shadow-lg shadow-blue-500/20">
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
              className="bg-gray-900 border-gray-800 p-6 rounded-2xl border-l-4 border-l-blue-500"
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
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Potencia Media
            </TabsTrigger>
            <TabsTrigger
              value="rpe"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Esfuerzo (RPE)
            </TabsTrigger>
            <TabsTrigger
              value="fatigue"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl text-gray-400 font-bold transition-all"
            >
              Fatiga Acumulada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="power">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl">
              <CardTitle className="mb-8 flex items-center gap-3 text-blue-500 font-black">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                ANÁLISIS DE POTENCIA
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
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
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
                      itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="power"
                      stroke="#3b82f6"
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
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl">
              <CardTitle className="mb-8 flex items-center gap-3 text-blue-500 font-black">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                RELACIÓN DE ESFUERZO
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
            <CardTitle className="mb-6 font-black italic uppercase">
              Próximos Objetivos
            </CardTitle>
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
                  <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-blue-500">{goal.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {goal.date}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl border-r-4 border-r-blue-500/20">
            <CardTitle className="mb-6 font-black italic uppercase">
              Insights de IA
            </CardTitle>
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
              <p className="text-blue-200 leading-relaxed italic">
                "Basado en tus últimos entrenamientos de alta intensidad, tu
                fatiga muscular está aumentando. Se recomienda un día de
                recuperación activa mañana para optimizar tu CP el fin de
                semana."
              </p>
              <Button
                variant="link"
                className="text-blue-500 font-bold p-0 mt-4 uppercase tracking-widest text-xs"
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
