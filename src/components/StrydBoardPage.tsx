import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Settings,
  Calendar,
  Zap,
  Activity,
  Award,
  TrendingUp,
  Map,
  MessageSquare,
  BarChart2,
} from 'lucide-react'
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
import { PerformanceChart } from '@/components/PerformanceChart'
import { PRCard } from '@/components/PRCard'
import { useEffect, useMemo } from 'react'

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
  const [isUploading, setIsUploading] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [newReview, setNewReview] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    startDate: '',
    reviews: [] as any[],
    stravaConnected: false,
    coachMessages: [] as any[],
  })

  const [metrics, setMetrics] = useState<any[]>([])
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)
  const [ftp, setFtp] = useState<number | undefined>(undefined)
  const [performanceStats, setPerformanceStats] = useState({
    rss: 0,
    ctl: 0,
    atl: 0,
    tsb: 0,
    weekKm: 0,
    weekDays: 0,
    monthKm: 0,
    yearKm: 0,
    yearDays: 0,
    weeklyComparison: {
      thisWeek: [] as number[],
      lastWeek: [] as number[],
      average: 0,
    },
    monthlyComparison: {
      thisMonth: [] as number[],
      lastMonth: [] as number[],
    },
    rampRate: 0,
  })

  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [profileTab, setProfileTab] = useState('estadisticas')
  const [showHistory, setShowHistory] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('es-PA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      })

      const data = (await response.json()) as any

      if (!response.ok) {
        setLoginError(data.error || 'Error al iniciar sesión')
        return
      }

      const profileData = {
        fullName: data.fullName || '',
        idCard: data.idCard || '',
        email: data.email || '',
        phone: data.phone || '',
        birthDate: data.birthDate || '',
        gender: data.gender || '',
        province: data.province || '',
        photoUrl: data.photoUrl || null,

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
        startDate: data.startDate || '',
        reviews: data.reviews || [],
        stravaConnected: !!data.stravaRefreshToken,
        coachMessages: [], // Will be fetched separately or populated if included in login data
      }

      // Populate profile with real data
      setProfile(profileData)

      setCurrentUserId(data.id)
      setIsLoggedIn(true)
      setView('landing')

      // Guardar sesión en localStorage
      localStorage.setItem(
        'strydboard_session',
        JSON.stringify({
          userId: data.id,
          profile: profileData,
        }),
      )
    } catch (error) {
      setLoginError('Error de conexión')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('strydboard_session')
    setIsLoggedIn(false)
    setCurrentUserId(null)
    setView('landing')
  }

  useEffect(() => {
    // Restaurar sesión al cargar
    const storedSession = localStorage.getItem('strydboard_session')
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        if (session && session.userId && session.profile) {
          setCurrentUserId(session.userId)
          setProfile(session.profile)
          setIsLoggedIn(true)
        }
      } catch (e) {
        console.error('Error parsing session data', e)
        localStorage.removeItem('strydboard_session')
      }
    }
  }, [])

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
        // Update the persisted session
        localStorage.setItem(
          'strydboard_session',
          JSON.stringify({
            userId: currentUserId,
            profile: profile,
          }),
        )

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = (await response.json()) as { key: string }
        const newPhotoUrl = data.key

        // Update local state and also automatically persist it to the database
        const updatedProfile = { ...profile, photoUrl: newPhotoUrl }
        setProfile(updatedProfile)

        // Update the persisted session
        localStorage.setItem(
          'strydboard_session',
          JSON.stringify({
            userId: currentUserId,
            profile: updatedProfile,
          }),
        )

        // Auto-save the profile so the new photo appears immediately on the team page
        await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUserId,
            ...updatedProfile, // Send the completely updated profile
          }),
        })

        setSaveMessage('Foto de perfil actualizada con éxito')
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage('Error al subir la imagen')
      }
    } catch (error) {
      setSaveMessage('Error de conexión al subir imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddReview = async () => {
    if (!newReview.trim() || !currentUserId) return

    setIsSubmittingReview(true)
    try {
      const response = await fetch('/api/profile/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          content: newReview,
        }),
      })

      if (response.ok) {
        const data = (await response.json()) as { review: any }
        const updatedProfile = {
          ...profile,
          reviews: [data.review, ...profile.reviews],
        }

        setProfile(updatedProfile)

        // Update the persisted session
        localStorage.setItem(
          'strydboard_session',
          JSON.stringify({
            userId: currentUserId,
            profile: updatedProfile,
          }),
        )

        setNewReview('')
        setSaveMessage('Reseña agregada con éxito')
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage('Error al agregar la reseña')
      }
    } catch (error) {
      setSaveMessage('Error de conexión')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const fetchMetrics = async () => {
    if (!currentUserId) return
    setIsLoadingMetrics(true)
    try {
      const response = await fetch(
        `/api/strava/metrics?userId=${currentUserId}&month=${selectedMonth}&year=${selectedYear}`,
      )
      if (response.ok) {
        const data = (await response.json()) as any
        setMetrics(data.metrics)
        setFtp(data.ftp)
        setPerformanceStats((prev) => ({
          ...prev,
          rss: data.rss,
          ctl: data.ctl,
          atl: data.atl,
          tsb: data.tsb,
          weekKm: data.weekKm,
          weekDays: data.weekDays,
          monthKm: data.monthKm,
          yearKm: data.yearKm,
          yearDays: data.yearDays,
          weeklyComparison: data.weeklyComparison || {
            thisWeek: [],
            lastWeek: [],
            average: 0,
          },
          monthlyComparison: data.monthlyComparison || {
            thisMonth: [],
            lastMonth: [],
          },
          rampRate: data.rampRate || 0,
        }))
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setIsLoadingMetrics(false)
    }
  }

  const fetchCoachMessages = async () => {
    if (!currentUserId) return
    try {
      const response = await fetch(
        `/api/coach/messages/list?userId=${currentUserId}`,
      )
      if (response.ok) {
        const data = (await response.json()) as { coachMessages: any[] }
        setProfile((prev) => ({ ...prev, coachMessages: data.coachMessages }))
      }
    } catch (error) {
      console.error('Error fetching coach messages:', error)
    }
  }

  const handleMarkRead = async (messageId: number) => {
    try {
      const response = await fetch('/api/coach/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      })

      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          coachMessages: prev.coachMessages.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg,
          ),
        }))
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const getRampStatus = (value: number) => {
    if (value <= 2)
      return {
        label: 'Mantenimiento',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
      }
    if (value <= 5)
      return {
        label: 'Crecimiento Óptimo',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
      }
    if (value <= 8)
      return {
        label: 'Crecimiento Agresivo',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
      }
    return {
      label: 'Zona de Peligro',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    }
  }

  const getPerformanceSummary = () => {
    const { tsb, rampRate } = performanceStats
    let title = 'Análisis de Rendimiento'
    let message = ''
    let icon = <Activity className="w-6 h-6" />
    let colorClass = 'text-blue-400'
    let bgClass = 'bg-blue-500/10'

    if (tsb > 5) {
      title = 'Estado: Frescura'
      message =
        'Te encuentras en una zona de frescura óptima. Tus niveles de fatiga son bajos y estás listo para un esfuerzo máximo o una competición. ¡Es el momento ideal para brillar!'
      icon = <Award className="w-6 h-6" />
      colorClass = 'text-green-400'
      bgClass = 'bg-green-500/20'
    } else if (tsb >= -10) {
      title = 'Estado: Mantenimiento'
      message =
        'Estás manteniendo un equilibrio excelente entre carga y recuperación. Sigue con tu plan actual para consolidar tu forma física sin riesgos innecesarios.'
      icon = <Activity className="w-6 h-6" />
      colorClass = 'text-blue-400'
      bgClass = 'bg-blue-500/20'
    } else if (tsb >= -30) {
      title = 'Estado: Crecimiento Productivo'
      message =
        "Estás en la 'zona dulce' del entrenamiento. Estás acumulando carga de forma efectiva y mejorando tu CTL de manera sólida. ¡Sigue así, estás construyendo una base espectacular!"
      icon = <TrendingUp className="w-6 h-6" />
      colorClass = 'text-orange-400'
      bgClass = 'bg-orange-500/20'
    } else {
      title = 'Estado: Alta Fatiga'
      message =
        'Tu nivel de fatiga es elevado. Es un signo de entrenamiento duro, pero ten cuidado con el sobreentrenamiento. Valora un día de recuperación activa para asimilar el trabajo.'
      icon = <Zap className="w-6 h-6" />
      colorClass = 'text-red-400'
      bgClass = 'bg-red-500/20'
    }

    if (rampRate > 5) {
      message +=
        ' Además, tu rampa de crecimiento es extraordinaria, lo que indica una progresión muy sólida en los últimos días.'
    }

    return { title, message, icon, colorClass, bgClass }
  }

  useEffect(() => {
    if (view === 'performance' && currentUserId && profile.stravaConnected) {
      fetchMetrics()
    }
  }, [
    view,
    currentUserId,
    profile.stravaConnected,
    selectedMonth,
    selectedYear,
  ])

  useEffect(() => {
    if (currentUserId) {
      fetchCoachMessages()
    }
  }, [currentUserId])

  useEffect(() => {
    // Detect if we just connected Strava
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('strava') === 'connected' && !profile.stravaConnected) {
      setProfile((prev) => ({ ...prev, stravaConnected: true }))
      setSaveMessage('¡Strava conectado con éxito!')
      setTimeout(() => setSaveMessage(null), 5000)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [profile.stravaConnected])

  const handleStravaConnect = () => {
    const clientId = '197123' // From .env
    const redirectUri = `${window.location.origin}/api/strava/auth`
    const scope = 'activity:read_all'
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${currentUserId}`
    window.location.href = authUrl
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-4">
              MI <span className="text-orange-500">PERFORMANCE</span>
            </h2>
            <p className="text-gray-400 font-medium">
              Analiza tu potencia, fatiga y progreso semanal.
            </p>
            {profile.coachMessages.filter((msg: any) => !msg.isRead).length >
              0 && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">
                <MessageSquare className="w-3 h-3" />
                {
                  profile.coachMessages.filter((msg: any) => !msg.isRead).length
                }{' '}
                Mensajes
              </div>
            )}
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
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setView('landing')}
              className="text-orange-500 hover:underline flex items-center gap-2 font-bold"
            >
              ← Volver al inicio
            </button>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Premium App-Style Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-1">
              <h1 className="text-4xl font-black">Perfil</h1>
              <button className="text-orange-500 font-bold hover:underline py-1">
                Más información
              </button>
            </div>
            <p className="text-gray-400 mb-8">{todayStr}</p>

            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-900 shadow-2xl relative">
                    {profile.photoUrl ? (
                      <ImageWithFallback
                        src={
                          profile.photoUrl.startsWith('http') ||
                          profile.photoUrl.startsWith('/')
                            ? profile.photoUrl
                            : `/api/files/${profile.photoUrl}`
                        }
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white shadow-lg hover:bg-orange-600 transition-all border-2 border-black scale-90"
                    title="Cambiar foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  {profile.fullName.split(' ')[0]}
                </h2>
              </div>
              <button className="p-3 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition-all shadow-xl group">
                <Settings className="w-8 h-8 text-white group-hover:rotate-45 transition-transform duration-500" />
              </button>
            </div>

            {/* Premium Header is enough, we remove the tabs */}
          </div>

          <div className="space-y-12">
            {/* The form is the main content now */}
            <form
              onSubmit={handleSaveProfile}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* Columna Izquierda: Foto e Info Básica */}
              <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6 group">
                    <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center border-4 border-orange-500/20 overflow-hidden relative">
                      {profile.photoUrl ? (
                        <ImageWithFallback
                          src={
                            profile.photoUrl.startsWith('http') ||
                            profile.photoUrl.startsWith('/')
                              ? profile.photoUrl
                              : `/api/files/${profile.photoUrl}`
                          }
                          alt={profile.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
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
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white shadow-lg hover:bg-orange-600 transition-all border-2 border-gray-900"
                      title="Cambiar foto"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <h2 className="text-2xl font-black mb-1">
                    {profile.fullName}
                  </h2>
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
                      {
                        label: '21K',
                        key: 'record21k',
                        placeholder: '00:00:00',
                      },
                      {
                        label: '42K',
                        key: 'record42k',
                        placeholder: '00:00:00',
                      },
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
                            setProfile({
                              ...profile,
                              [rec.key]: e.target.value,
                            })
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
                          setProfile({
                            ...profile,
                            footwearType: e.target.value,
                          })
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
                            setProfile({
                              ...profile,
                              strydUser: e.target.value,
                            })
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
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
                        Miembro Desde
                      </Label>
                      <div className="flex gap-3 p-3 bg-gray-800/50 rounded-2xl border border-gray-800 focus-within:border-orange-500/50 transition-all">
                        <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-orange-500 shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <Input
                          type="date"
                          value={profile.startDate}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              startDate: e.target.value,
                            })
                          }
                          className="bg-transparent border-none text-white focus:ring-0 p-0 h-10 w-full [color-scheme:dark]"
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

                {/* Reviews Section */}
                <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl mt-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="p-1.5 bg-orange-500/10 rounded-lg font-black italic">
                      💬
                    </span>
                    Mis Reseñas
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <textarea
                        placeholder="Escribe tu reseña aquí..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none min-h-[120px] transition-all placeholder:text-gray-600"
                      />
                      <Button
                        type="button"
                        onClick={handleAddReview}
                        disabled={isSubmittingReview || !newReview.trim()}
                        className="w-full bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white border border-orange-500/20 font-bold rounded-xl py-4 transition-all"
                      >
                        {isSubmittingReview ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          '+ Agregar Reseña'
                        )}
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {profile.reviews.length === 0 ? (
                        <p className="text-gray-600 text-center italic py-4">
                          Aún no tienes reseñas.
                        </p>
                      ) : (
                        profile.reviews.map((review, i) => (
                          <div
                            key={review.id || i}
                            className="p-4 bg-gray-800/30 border border-gray-800 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
                          >
                            <p className="text-gray-300 text-sm leading-relaxed mb-3">
                              "{review.content}"
                            </p>
                            <div className="flex justify-end italic">
                              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">
                                {new Date(
                                  Number(review.createdAt) * 1000,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </form>
          </div>
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
              {profile.fullName} • Análisis de entrenamiento
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              Cerrar Sesión
            </button>
            {profile.stravaConnected && (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-4"
                disabled={isLoadingMetrics}
                onClick={fetchMetrics}
              >
                {isLoadingMetrics ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Sincronizar'
                )}
              </Button>
            )}
          </div>
        </header>

        {!profile.stravaConnected ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 fill-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.67h4.151L10.377 0 4.85 11.084h4.15z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">
              Análisis de <span className="text-orange-500">Rendimiento</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
              Para desbloquear tus métricas avanzadas de entrenamiento (CTL,
              ATL, TSB), necesitamos conectarnos con tu cuenta de Strava. Esto
              nos permitirá procesar tus actividades y mostrarte tu estado de
              forma real.
            </p>

            <Button
              onClick={handleStravaConnect}
              className="bg-[#FC4C02] hover:bg-[#E34402] text-white font-black py-8 px-10 rounded-2xl text-lg shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 group flex items-center gap-3"
            >
              <span>INICIAR SESIÓN CON STRAVA</span>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-current stroke-2 transition-transform group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>

            <p className="mt-8 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
              Conexión segura vía Strava API v3
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                {
                  label: 'Fitness (CTL)',
                  value: performanceStats.ctl.toFixed(2),
                  delta: 'Forma actual',
                  color: 'text-orange-500',
                  icon: <Activity className="w-4 h-4" />,
                },
                {
                  label: 'RSS (7d)',
                  value: performanceStats.rss,
                  delta: 'Carga semanal',
                  color: 'text-blue-400',
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  label: 'Fatiga (ATL)',
                  value: performanceStats.atl.toFixed(2),
                  delta: 'Cansancio',
                  color: 'text-red-400',
                  icon: <TrendingUp className="w-4 h-4" />,
                },
                {
                  label: 'Forma (TSB)',
                  value: performanceStats.tsb.toFixed(2),
                  delta: performanceStats.tsb > 0 ? 'Fresco' : 'Fatigado',
                  color:
                    performanceStats.tsb > 0
                      ? 'text-green-400'
                      : 'text-orange-400',
                  icon: <Award className="w-4 h-4" />,
                },
              ].map((stat, i) => (
                <Card
                  key={i}
                  className="bg-gray-900 border-gray-800 p-6 rounded-2xl border-l-4 border-l-orange-500 hover:bg-gray-800/50 transition-all cursor-default"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <div
                      className={cn('p-1.5 rounded-lg bg-gray-800', stat.color)}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white">
                      {stat.value}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-tighter opacity-70',
                        stat.color,
                      )}
                    >
                      {stat.delta}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Performance Chart */}
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-500">
                  <Activity className="w-5 h-5" />
                </span>
                GRÁFICA DE RENDIMIENTO
              </h2>
              <PerformanceChart data={metrics} ftp={ftp} />
            </div>

            {/* New Statistics Grid */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  ESTADÍSTICAS ADICIONALES
                </h2>

                {/* Month Selector */}
                <div className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
                  <select
                    className="bg-transparent text-white px-4 py-2 outline-none cursor-pointer text-sm font-bold appearance-none"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {[
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
                    ].map((m, i) => (
                      <option
                        key={i}
                        value={i}
                        className="bg-gray-900 text-white"
                      >
                        {m}
                      </option>
                    ))}
                  </select>
                  <div className="w-px bg-gray-800"></div>
                  <select
                    className="bg-transparent text-white px-4 py-2 outline-none cursor-pointer text-sm font-bold appearance-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {[2023, 2024, 2025, 2026].map((y) => (
                      <option
                        key={y}
                        value={y}
                        className="bg-gray-900 text-white"
                      >
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {[
                  {
                    label: 'KM X SEMANA',
                    value: `${performanceStats.weekKm} km`,
                    icon: <Map className="w-4 h-4" />,
                    color: 'text-blue-400',
                  },
                  {
                    label: 'RSS X SEMANA',
                    value: performanceStats.rss,
                    icon: <Zap className="w-4 h-4" />,
                    color: 'text-orange-400',
                  },
                  {
                    label: 'DÍAS T. (7D)',
                    value: `${performanceStats.weekDays} d`,
                    icon: <Calendar className="w-4 h-4" />,
                    color: 'text-green-400',
                  },
                  {
                    label: 'KM X MES',
                    value: `${performanceStats.monthKm} km`,
                    icon: <Map className="w-4 h-4" />,
                    color: 'text-purple-400',
                  },
                  {
                    label: 'KM TOTAL (AÑO)',
                    value: `${performanceStats.yearKm} km`,
                    icon: <TrendingUp className="w-4 h-4" />,
                    color: 'text-yellow-400',
                  },
                  {
                    label: 'DÍAS T. (AÑO)',
                    value: `${performanceStats.yearDays} d`,
                    icon: <Calendar className="w-4 h-4" />,
                    color: 'text-red-400',
                  },
                  {
                    label: 'RAMPA',
                    value: performanceStats.rampRate,
                    status: getRampStatus(performanceStats.rampRate),
                    icon: <TrendingUp className="w-4 h-4" />,
                    color: getRampStatus(performanceStats.rampRate).color,
                  },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className="bg-gray-900 border-gray-800 p-4 rounded-xl hover:border-gray-700 transition-all text-center flex flex-col items-center justify-between"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center',
                        stat.color,
                      )}
                    >
                      {stat.icon}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {stat.label}
                      </p>
                      <span className="text-xl font-black text-white">
                        {stat.value}
                      </span>
                      {stat.status && (
                        <div
                          className={cn(
                            'mt-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter',
                            stat.status.bg,
                            stat.status.color,
                          )}
                        >
                          {stat.status.label}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Performance Summary Card */}
            {(() => {
              const summary = getPerformanceSummary()
              return (
                <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl mb-12 relative group hover:border-blue-500/30 transition-all">
                  <div
                    className={cn(
                      'absolute top-0 right-0 p-8 opacity-5',
                      summary.colorClass,
                    )}
                  >
                    {summary.icon}
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div
                      className={cn(
                        'p-6 rounded-2xl flex items-center justify-center shadow-inner',
                        summary.bgClass,
                        summary.colorClass,
                      )}
                    >
                      {summary.icon}
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'text-2xl font-black mb-3 uppercase tracking-tight',
                          summary.colorClass,
                        )}
                      >
                        {summary.title}
                      </h3>
                      <p className="text-xl text-gray-300 leading-relaxed font-medium">
                        {summary.message}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })()}

            {/* Personal Records (PRs) */}
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-500">
                  🏆
                </span>
                Mejores marcas personales
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6 items-start">
                {profile.record5k && (
                  <PRCard
                    distance="5km"
                    time={profile.record5k}
                    location="Pese"
                  />
                )}
                {profile.record10k && (
                  <PRCard
                    distance="10km"
                    time={profile.record10k}
                    location="Pese"
                  />
                )}
                {profile.record21k && (
                  <PRCard
                    distance="21.1km"
                    time={profile.record21k}
                    location="Chicago"
                  />
                )}
                {profile.record42k && (
                  <PRCard
                    distance="42.2km"
                    time={profile.record42k}
                    location="Maratón"
                  />
                )}
                <PRCard isAdd onClick={() => setView('profile')} />
              </div>
            </div>

            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                    <MessageSquare className="w-8 h-8" />
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    TABLÓN DEL <span className="text-blue-500">COACH</span>
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {profile.coachMessages.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                        showHistory
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600',
                      )}
                    >
                      {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
                    </button>
                  )}
                  {profile.coachMessages.filter((m) => !m.isRead).length >
                    0 && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                      {profile.coachMessages.filter((m) => !m.isRead).length}{' '}
                      Nuevos
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {(showHistory
                  ? profile.coachMessages
                  : profile.coachMessages.filter((msg: any) => !msg.isRead)
                ).length === 0 ? (
                  <div className="text-center py-16 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                    <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-600">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest italic text-sm">
                      {showHistory
                        ? 'No hay historial de mensajes.'
                        : 'No hay mensajes nuevos del coach.'}
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-blue-500/20 ml-4 pl-8 space-y-8">
                    {(showHistory
                      ? profile.coachMessages
                      : profile.coachMessages.filter((msg: any) => !msg.isRead)
                    ).map((msg: any) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'relative transition-all duration-500',
                          msg.isRead && !showHistory
                            ? 'opacity-0 scale-95 h-0 overflow-hidden'
                            : 'opacity-100 scale-100',
                        )}
                      >
                        <div
                          className={cn(
                            'absolute -left-10 top-0 w-4 h-4 rounded-full border-4 border-black transition-all',
                            msg.isRead
                              ? 'bg-gray-700'
                              : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
                          )}
                        ></div>
                        <div
                          className={cn(
                            'bg-gray-900 border p-6 rounded-3xl transition-all group',
                            msg.isRead
                              ? 'border-gray-800 opacity-60'
                              : 'border-gray-800 hover:border-blue-500/30',
                          )}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest',
                                  msg.isRead
                                    ? 'bg-gray-800 text-gray-500'
                                    : 'bg-blue-500/10 text-blue-500',
                                )}
                              >
                                {msg.isRead ? 'Archivado' : 'Coach Direct'}
                              </span>
                              {!msg.isRead && (
                                <button
                                  onClick={() => handleMarkRead(msg.id)}
                                  className="text-[10px] text-gray-500 hover:text-blue-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
                                >
                                  Entendido / Leído
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">
                              {(() => {
                                if (!msg.createdAt) return 'Fecha desconocida'
                                let date = new Date(msg.createdAt)
                                if (isNaN(date.getTime())) {
                                  const ts = Number(msg.createdAt)
                                  if (!isNaN(ts)) {
                                    date = new Date(
                                      ts * (ts < 10000000000 ? 1000 : 1),
                                    )
                                  }
                                }
                                return isNaN(date.getTime())
                                  ? 'Fecha desconocida'
                                  : date.toLocaleDateString('es-PA', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                              })()}
                            </span>
                          </div>
                          <p className="text-lg text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Performance Comparison (Image Reference) */}
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-1">
                    Total
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.3)]"></div>
                      <span className="text-gray-400 text-sm font-bold">
                        Semana anterior
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#4ade80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.3)]"></div>
                      <span className="text-gray-400 text-sm font-bold">
                        Esta semana
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-sm font-bold">
                        Media
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-100 w-full relative">
                {isLoadingMetrics ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                  </div>
                ) : (
                  <div className="h-full w-full">
                    {/* Y-axis labels manually to match the clean style or via Recharts */}
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            day: 'l',
                            last:
                              performanceStats.weeklyComparison.lastWeek[0] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[0] ||
                              0,
                          },
                          {
                            day: 'm',
                            last:
                              performanceStats.weeklyComparison.lastWeek[1] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[1] ||
                              0,
                          },
                          {
                            day: 'm',
                            last:
                              performanceStats.weeklyComparison.lastWeek[2] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[2] ||
                              0,
                          },
                          {
                            day: 'j',
                            last:
                              performanceStats.weeklyComparison.lastWeek[3] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[3] ||
                              0,
                          },
                          {
                            day: 'v',
                            last:
                              performanceStats.weeklyComparison.lastWeek[4] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[4] ||
                              0,
                          },
                          {
                            day: 's',
                            last:
                              performanceStats.weeklyComparison.lastWeek[5] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[5] ||
                              0,
                          },
                          {
                            day: 'd',
                            last:
                              performanceStats.weeklyComparison.lastWeek[6] ||
                              0,
                            current:
                              performanceStats.weeklyComparison.thisWeek[6] ||
                              0,
                          },
                        ]}
                        margin={{ top: 40, right: 30, left: -20, bottom: 20 }}
                        barGap={8}
                      >
                        <CartesianGrid
                          strokeDasharray="0"
                          stroke="#374151"
                          vertical={false}
                          horizontal={true}
                        />
                        <XAxis
                          dataKey="day"
                          stroke="#9ca3af"
                          fontSize={18}
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          dy={15}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={16}
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 'dataMax + 5']}
                          ticks={[5, 10, 15]}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl shadow-2xl">
                                  <p className="text-white font-black uppercase text-xs mb-2">{`Día ${payload[0].payload.day.toUpperCase()}`}</p>
                                  {payload.map((entry: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                      ></div>
                                      <span className="text-gray-400 text-[10px] font-bold uppercase">
                                        {entry.name}:
                                      </span>
                                      <span className="text-white font-black">
                                        {entry.value} km
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        {/* Reference Line for Average */}
                        <Line
                          type="monotone"
                          dataKey={() =>
                            performanceStats.weeklyComparison.average
                          }
                          stroke="#4ade80"
                          strokeWidth={3}
                          strokeDasharray="8 8"
                          dot={false}
                          isAnimationActive={false}
                        />
                        <Bar
                          dataKey="last"
                          name="Semana anterior"
                          fill="#facc15"
                          radius={[10, 10, 0, 0]}
                          barSize={32}
                          label={({ x, y, width, value }: any) => {
                            if (value === 0 || value < 10) return null // Only show top label for large values like in image
                            return (
                              <g>
                                <rect
                                  x={x + width / 2 - 35}
                                  y={y - 45}
                                  width={70}
                                  height={35}
                                  rx={17}
                                  fill="#facc15"
                                />
                                <text
                                  x={x + width / 2}
                                  y={y - 23}
                                  fill="black"
                                  textAnchor="middle"
                                  fontSize={14}
                                  fontWeight="black"
                                >
                                  {value}km
                                </text>
                              </g>
                            )
                          }}
                        />
                        <Bar
                          dataKey="current"
                          name="Esta semana"
                          fill="#4ade80"
                          radius={[10, 10, 0, 0]}
                          barSize={32}
                          label={({ x, y, width, value }: any) => {
                            if (value === 0) return null
                            return (
                              <g>
                                <rect
                                  x={x + width / 2 - 35}
                                  y={y - 45}
                                  width={78}
                                  height={35}
                                  rx={17}
                                  fill="#4ade80"
                                />
                                <text
                                  x={x + width / 2}
                                  y={y - 23}
                                  fill="black"
                                  textAnchor="middle"
                                  fontSize={14}
                                  fontWeight="black"
                                >
                                  {value}km
                                </text>
                                <path
                                  d={`M${x + width / 2} ${y - 12} L${x + width / 2 - 6} ${y - 20} L${x + width / 2 + 6} ${y - 20} Z`}
                                  fill="#4ade80"
                                />
                              </g>
                            )
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="absolute left-0 -bottom-2 text-gray-500 font-bold text-sm">
                      km
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Monthly Comparison */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                    <BarChart2 className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white m-0 leading-none">
                      COMPARACIÓN MENSUAL
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                      DISTANCIA DIARIA (KM)
                    </p>
                  </div>
                </div>

                <div className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all shadow-inner">
                  <div className="bg-gray-800/50 px-3 py-2 flex items-center justify-center border-r border-gray-800">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center px-4 py-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#facc15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                      <span className="text-gray-400 text-sm font-bold">
                        Mes anterior
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#4ade80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      <span className="text-gray-400 text-sm font-bold">
                        Este mes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full relative mt-8">
                {isLoadingMetrics ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                  </div>
                ) : (
                  <div className="h-full w-full overflow-x-auto thin-scrollbar">
                    <div className="h-full min-w-200 md:min-w-full pb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Array.from({ length: 31 }).map((_, i) => ({
                            day: String(i + 1),
                            last:
                              performanceStats.monthlyComparison.lastMonth[i] ||
                              0,
                            current:
                              performanceStats.monthlyComparison.thisMonth[i] ||
                              0,
                          }))}
                          margin={{ top: 40, right: 30, left: -20, bottom: 20 }}
                          barGap={2}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1f2937"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl shadow-xl">
                                    <p className="text-white font-bold text-xs mb-2">
                                      Día {payload[0].payload.day}
                                    </p>
                                    {payload.map(
                                      (entry: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2 mb-1"
                                        >
                                          <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                              backgroundColor: entry.color,
                                            }}
                                          ></div>
                                          <span className="text-gray-400 text-[10px] uppercase font-bold">
                                            {entry.name}:
                                          </span>
                                          <span className="text-white text-xs font-black">
                                            {entry.value} km
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar
                            dataKey="last"
                            name="Mes anterior"
                            fill="#facc15"
                            radius={[4, 4, 0, 0]}
                            barSize={12}
                          />
                          <Bar
                            dataKey="current"
                            name="Este mes"
                            fill="#4ade80"
                            radius={[4, 4, 0, 0]}
                            barSize={12}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
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
                    ANÁLISIS DE RENDIMIENTO (CTL / ATL / TSB)
                  </CardTitle>
                  {isLoadingMetrics ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <PerformanceChart data={metrics} ftp={ftp} />
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="rpe">
                <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl">
                  <CardTitle className="mb-8 flex items-center gap-3 text-blue-500 font-black">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    CARGA DIARIA (TSS) - ÚLTIMOS 7 DÍAS
                  </CardTitle>
                  <div className="h-[400px] w-full">
                    {isLoadingMetrics ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={metrics.slice(-7).map((m) => ({
                            ...m,
                            day: new Date(
                              m.date + 'T00:00:00',
                            ).toLocaleDateString('es-PA', { weekday: 'short' }),
                          }))}
                        >
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
                          <Bar
                            dataKey="tss"
                            name="Carga (TSS)"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="fatigue">
                <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl overflow-hidden shadow-2xl">
                  <CardTitle className="mb-4 flex items-center gap-3 text-red-500 font-black">
                    <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                    GESTIÓN DE FATIGA (ATL vs TSB)
                  </CardTitle>
                  <p className="text-gray-400 mb-8 text-sm font-medium">
                    Analiza cómo tu cansancio acumulado (rojo) influye en tu
                    frescura para competir (área inferior).
                  </p>
                  <div className="h-[400px] w-full">
                    {isLoadingMetrics ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={metrics.slice(-30)}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorAtl"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#ef4444"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorTsb"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
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
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(str) => {
                              const d = new Date(str + 'T00:00:00')
                              return d.toLocaleDateString('es-PA', {
                                day: 'numeric',
                                month: 'short',
                              })
                            }}
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
                            labelStyle={{
                              color: '#9ca3af',
                              fontWeight: 'bold',
                              marginBottom: '8px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="atl"
                            name="Fatiga (ATL)"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAtl)"
                          />
                          <Area
                            type="monotone"
                            dataKey="tsb"
                            name="Balance (TSB)"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTsb)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Insights and Objectives hidden until we have real data feed */}
          </>
        )}
      </div>
    </div>
  )
}
