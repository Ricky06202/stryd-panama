import { useState, useEffect, useCallback, useRef } from 'react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: number
  content: string
  createdAt: string
  authorName: string
  authorPhoto: string | null
}

interface ReviewsCarouselProps {
  reviews: Review[]
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [itemsToShow, setItemsToShow] = useState(1)

  const autoPlayDuration = 5000 // 5 seconds
  const totalReviews = reviews.length

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isPaused || totalReviews <= itemsToShow) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % totalReviews)
    }, autoPlayDuration)
    return () => clearInterval(interval)
  }, [isPaused, totalReviews, itemsToShow])

  if (totalReviews === 0) return null

  // We use 3 sets to allow some infinite feel without complex jumps for now
  const displayReviews = [...reviews, ...reviews, ...reviews]

  return (
    <div
      className="relative w-full py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden px-4 md:px-12">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            // The percentage in translateX refers to the element's own width (the 15-item flex container).
            // To move by 1 item, we shift by (1 / total_items) * 100%.
            transform: `translateX(-${((active + totalReviews) / displayReviews.length) * 100}%)`,
            width: `${displayReviews.length * (100 / itemsToShow)}%`,
          }}
        >
          {displayReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              style={{ width: `${100 / displayReviews.length}%` }}
              className="px-2 md:px-4 shrink-0"
            >
              <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-6 md:p-8 rounded-3xl h-full flex flex-col justify-between hover:border-orange-500/30 transition-all group">
                <div className="relative">
                  <Quote className="w-8 h-8 md:w-10 md:h-10 text-orange-500/10 absolute -top-4 -left-4 group-hover:text-orange-500/20 transition-colors" />
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed italic relative z-10 mb-8 line-clamp-6">
                    "{review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors bg-gray-800">
                    {review.authorPhoto && review.authorPhoto.trim() !== '' ? (
                      <ImageWithFallback
                        src={
                          review.authorPhoto.startsWith('http') ||
                          review.authorPhoto.startsWith('/api/files/') ||
                          review.authorPhoto.startsWith('/')
                            ? review.authorPhoto
                            : `/api/files/${review.authorPhoto}`
                        }
                        alt={review.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-500 font-black text-lg">
                        {review.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">
                      {review.authorName}
                    </h4>
                    <p className="text-orange-500/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
                      Stryd Panama Athlete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      {totalReviews > itemsToShow && (
        <>
          <button
            onClick={() =>
              setActive((prev) => (prev - 1 + totalReviews) % totalReviews)
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 text-gray-500 hover:text-orange-500 transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={() => setActive((prev) => (prev + 1) % totalReviews)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 text-gray-500 hover:text-orange-500 transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Navigation markers (dots) */}
      <div className="flex justify-center gap-2 mt-8 md:mt-12">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              idx === active
                ? 'w-6 md:w-8 bg-orange-500 shadow-lg shadow-orange-500/40'
                : 'w-2 bg-gray-800 hover:bg-gray-700',
            )}
            aria-label={`Go to review ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
