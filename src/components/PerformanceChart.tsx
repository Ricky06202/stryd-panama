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

interface PerformanceData {
  date: string
  tss: number
  ctl: number
  atl: number
  tsb: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
  ftp?: number
}

export function PerformanceChart({ data, ftp }: PerformanceChartProps) {
  return (
    <div className="h-[500px] w-full bg-gray-900/50 p-4 rounded-3xl border border-gray-800">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
            fontSize={12}
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
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          />
          <Legend verticalAlign="top" height={36} />

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
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            opacity={0.6}
            barSize={20}
          />

          {/* CTL - Fitness (Line) */}
          <Line
            type="monotone"
            dataKey="ctl"
            name="Fitness (CTL)"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={false}
          />

          {/* ATL - Fatigue (Line) */}
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
                value: `FTP: ${ftp}W`,
                fill: '#6b7280',
                fontSize: 10,
              }}
            />
          )}

          <ReferenceLine y={0} stroke="#1f2937" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
