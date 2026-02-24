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
  days = 90,
): DayStats[] {
  // 1. Mapear actividades a un objeto por fecha
  const loadByDate: Record<string, number> = {}
  activities.forEach((a) => {
    loadByDate[a.date] = (loadByDate[a.date] || 0) + a.tss
  })

  // 2. Generar serie temporal continua
  const stats: DayStats[] = []
  let currentCTL = 0
  let currentATL = 0

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const tss = loadByDate[dateStr] || 0

    // EWMA calculations
    currentCTL = currentCTL + (tss - currentCTL) * (1 / 42)
    currentATL = currentATL + (tss - currentATL) * (1 / 7)

    stats.push({
      date: dateStr,
      tss,
      ctl: Math.round(currentCTL * 10) / 10,
      atl: Math.round(currentATL * 10) / 10,
      tsb: Math.round((currentCTL - currentATL) * 10) / 10,
    })
  }

  return stats
}
