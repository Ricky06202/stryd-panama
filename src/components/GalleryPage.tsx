import React, { useEffect, useState } from 'react'

interface GalleryItem {
  id: number
  imageUrl: string
  caption: string | null
  link: string | null
  displayOrder: number
  createdAt: string
}

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery')
        if (!res.ok) throw new Error('Failed to fetch gallery')
        const data = await res.json()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive font-medium">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          No hay fotos en la galería todavía.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.link || '#'}
          target={item.link ? '_blank' : undefined}
          rel={item.link ? 'noopener noreferrer' : undefined}
          className={`group relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border flex flex-col transition-all hover:scale-[1.02] active:scale-[0.98] ${
            !item.link ? 'cursor-default' : ''
          }`}
        >
          <img
            src={`/api/files/${item.imageUrl}`}
            alt={item.caption || 'Foto de Stryd Panama'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay with Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            {item.caption && (
              <p className="text-white text-xs md:text-sm font-medium line-clamp-3 mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {item.caption}
              </p>
            )}
            {item.link && (
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Ver en Instagram
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
