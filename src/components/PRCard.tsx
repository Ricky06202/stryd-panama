import React from 'react'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface PRCardProps {
  distance?: string
  time?: string
  location?: string
  isAdd?: boolean
  onClick?: () => void
  className?: string
}

export function PRCard({
  distance = '',
  time = '',
  location,
  isAdd,
  onClick,
  className,
}: PRCardProps) {
  if (isAdd) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onClick}
          className={cn(
            'w-36 h-44 bg-[#1A1A1A] rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-4 transition-all hover:border-blue-500/50 hover:bg-gray-800 shadow-2xl group',
            className,
          )}
        >
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" strokeWidth={3} />
          </div>
        </button>
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider text-center max-w-[140px] leading-tight">
          Añadir nueva mejor marca personal
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          'w-36 h-44 bg-[#262626] rounded-2xl border border-gray-800 overflow-visible flex flex-col shadow-2xl relative',
          className,
        )}
      >
        {/* Top Icon section */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="text-[#EF4444]">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l.89-4.42-2.1-1.03c-.52-.26-.83-.78-.83-1.37V8.42c0-.82.67-1.48 1.48-1.48s1.48.67 1.48 1.48v2.1l1.52.75 1.57-2.3c.35-.51.93-.82 1.55-.82h2.27c.41 0 .74.33.74.74s-.33.74-.74.74h-1.63L14.7 13l2.09 5.08c.15.36.01.78-.32.98-.33.2-.76.12-.99-.18l-1.92-2.48-2.29 2.11c-.2.18-.46.28-.73.28-.55 0-.96-.48-.88-1.02l.24-1.2h-.01z" />
            </svg>
          </div>
        </div>

        {/* Banner with time - Ribbon style */}
        <div className="relative w-[calc(100%+16px)] left-[-8px] h-10 flex items-center justify-center z-10">
          {/* Ribbon wings (underlay) */}
          <div
            className="absolute left-0 top-[2px] w-4 h-8 bg-[#CC3333] -z-10"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 40% 50%, 0 0)',
            }}
          ></div>
          <div
            className="absolute right-0 top-[2px] w-4 h-8 bg-[#CC3333] -z-10"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%)',
            }}
          ></div>

          {/* Ribbon folding part (shadow/depth) */}
          <div
            className="absolute left-2 bottom-[-4px] w-2 h-2 bg-[#992222] -z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
          ></div>
          <div
            className="absolute right-2 bottom-[-4px] w-2 h-2 bg-[#992222] -z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          ></div>

          <div className="w-[calc(100%-8px)] bg-[#EF4444] py-1.5 text-center shadow-lg relative">
            <span className="text-white font-black text-xl tracking-tight leading-none drop-shadow-sm">
              {time}
            </span>
          </div>
        </div>

        {/* Distance section */}
        <div className="py-4 text-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {distance}
          </span>
        </div>
      </div>

      {location && (
        <span className="text-white text-lg font-bold capitalize">
          {location}
        </span>
      )}
    </div>
  )
}
