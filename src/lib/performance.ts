export interface TrainingActivity {
  date: string // YYYY-MM-DD
  tss: number
}

export interface DayStats {
  date: string
  tss: number
  ctl: number
  atl: number
  tsb: number
}

/**
 * Calculates TSS (Training Stress Score)
 * Formulas:
 * Power: (seconds * NP * IF) / (FTP * 36) -> NP is usually not available in simplified API,
 * using weighted_average_watts as proxy for NP if missing or just average_watts.
 * HR: strava suffer_score
 * Fallback: hours * 50
 */
export function calculateTSS(activity: any, ftp?: number): number {
  // 1. Potencia (si hay potencia y FTP)
  if (activity.device_watts && activity.weighted_average_watts && ftp) {
    const seconds = activity.moving_time
    const np = activity.weighted_average_watts
    const if_score = np / ftp
    return (seconds * np * if_score) / (ftp * 36)
  }

  // 2. FC (Suffer Score de Strava)
  if (activity.suffer_score) {
    return activity.suffer_score
  }

  // 3. Fallback (Horas * 50)
  const hours = activity.moving_time / 3600
  return hours * 50
}

/**
 * Calculates CTL, ATL, TSB using EWMA
 * CTL_today = CTL_yesterday + (TSS_today - CTL_yesterday) * (1 / 42)
 * ATL_today = ATL_yesterday + (TSS_today - ATL_yesterday) * (1 / 7)
 * TSB = CTL - ATL
 */
export function calculatePerformanceTimeSeries(
  activities: TrainingActivity[],
  daysToReturn = 90,
): DayStats[] {
  // 1. Mapear actividades a un objeto por fecha
  const loadByDate: Record<string, number> = {}
  activities.forEach((a) => {
    loadByDate[a.date] = (loadByDate[a.date] || 0) + a.tss
  })

  // 2. Determinar el rango total de procesamiento vs el de retorno en America/Panama
  const getPanamaDate = (date: Date = new Date()) => {
    return new Date(
      date.toLocaleString('en-US', { timeZone: 'America/Panama' }),
    )
  }

  const todayPanama = getPanamaDate()
  const maxDate = new Date(todayPanama)
  maxDate.setHours(0, 0, 0, 0)

  // Encontrar la actividad más antigua
  const dates = activities.map((a) => new Date(a.date).getTime())
  const minDate =
    dates.length > 0 ? new Date(Math.min(...dates)) : new Date(maxDate)
  minDate.setHours(0, 0, 0, 0)

  const stats: DayStats[] = []
  let currentCTL = 0
  let currentATL = 0

  const returnStartDate = new Date(maxDate)
  returnStartDate.setDate(maxDate.getDate() - daysToReturn)

  // Procesar día a día desde la actividad más antigua o hace 1 año
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const tss = loadByDate[dateStr] || 0

    // EWMA calculations
    currentCTL = currentCTL + (tss - currentCTL) * (1 / 42)
    currentATL = currentATL + (tss - currentATL) * (1 / 7)

    // Solo guardar si está en el rango de retorno
    if (d >= returnStartDate) {
      stats.push({
        date: dateStr,
        tss,
        ctl: Math.round(currentCTL * 100) / 100,
        atl: Math.round(currentATL * 100) / 100,
        tsb: Math.round((currentCTL - currentATL) * 100) / 100,
      })
    }
  }

  return stats
}

/**
 * Calculates total TSS for a given number of days back from today
 */
export function calculateRSS(activities: TrainingActivity[], days = 7): number {
  const getPanamaDate = (date: Date = new Date()) => {
    return new Date(
      date.toLocaleString('en-US', { timeZone: 'America/Panama' }),
    )
  }

  const endDate = getPanamaDate()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const startStr = startDate.toISOString().split('T')[0]

  return Math.round(
    activities
      .filter((a) => a.date >= startStr)
      .reduce((acc, curr) => acc + curr.tss, 0),
  )
}
