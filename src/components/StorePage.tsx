import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function StorePage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="flex-1 w-full h-[calc(100vh-80px)] mt-0 relative overflow-hidden">
        <iframe
          src="https://tshirt-stryd.ricardosanjurg.workers.dev"
          className="absolute inset-0 w-full h-full border-none"
          title="Stryd Panama Shop"
          allow="payment"
        />
      </div>
    </div>
  )
}
