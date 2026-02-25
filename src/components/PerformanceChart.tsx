import { useState, useMemo } from 'react'
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { Button } from '@/components/ui/button'

interface PerformanceData {
  date: string
  tss: number
  ctl: number
  atl: number
  tsb: number
  ftp?: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  ftp?: number
}

export function PerformanceChart({ data, ftp }: PerformanceChartProps) {
  const [range, setRange] = useState(90)

  const filteredData = useMemo(() => {
    return data.slice(-range)
  }, [data, range])

  return (
    <div className="space-y-4">
      {/* Selector de Rango */}
      <div className="flex justify-end gap-2 px-2">
        {[30, 60, 90].map((r) => (
          <Button
            key={r}
            variant={range === r ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(r)}
            className={`h-8 rounded-lg text-xs font-bold ${
              range === r
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-none'
                : 'bg-black border-gray-800 text-gray-500 hover:text-white'
            }`}
          >
            {r}D
          </Button>
        ))}
      </div>

      <div className="h-[500px] w-full bg-gray-900/50 p-4 rounded-3xl border border-gray-800 overflow-x-auto overflow-y-hidden thin-scrollbar">
        <div className="h-full min-w-[700px] md:min-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorTsb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                  })
                }
              />
              <YAxis
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelStyle={{
                  color: '#9ca3af',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: '10px' }}
              />

              {/* TSB - Form (Area) */}
              <Area
                type="monotone"
                dataKey="tsb"
                name="Forma (TSB)"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTsb)"
                strokeWidth={2}
              />

              {/* TSS - Load (Bars) */}
              <Bar
                dataKey="tss"
                name="Carga (TSS)"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                opacity={0.6}
                barSize={range > 60 ? 6 : range > 30 ? 12 : 20}
              />

              {/* Fitness (CTL) */}
              <Line
                type="monotone"
                dataKey="ctl"
                name="Fitness (CTL)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
              />

              {/* FTP History (Step Line) */}
              <Line
                type="stepAfter"
                dataKey="ftp"
                name="FTP (W)"
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
                strokeOpacity={0.5}
              />

              {/* Fatigue (ATL) */}
              <Line
                type="monotone"
                dataKey="atl"
                name="Fatiga (ATL)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />

              {ftp && (
                <ReferenceLine
                  y={ftp}
                  stroke="#6b7280"
                  strokeDasharray="3 3"
                  label={{
                    position: 'right',
                    value: `Actual: ${ftp}W`,
                    fill: '#6b7280',
                    fontSize: 10,
                  }}
                />
              )}

              <ReferenceLine y={0} stroke="#1f2937" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
