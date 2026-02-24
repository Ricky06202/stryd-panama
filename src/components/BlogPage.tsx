import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Calendar, User, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogPost {
  id: number
  title: string
  content: string
  slug: string
  image?: string
  link?: string
  createdAt: string
  // UI-only placeholders for now or added to DB later if needed
  category?: string
  author?: string
  readTime?: string
}

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data as BlogPost[])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching posts:', err)
        setLoading(false)
      })
  }, [])

  const categories = [
    { value: 'todos', label: 'Todos los Artículos', color: 'bg-gray-500' },
    { value: 'stryd', label: 'Novedades Stryd', color: 'bg-orange-500' },
    { value: 'nutricion', label: 'Nutrición', color: 'bg-green-500' },
    { value: 'tecnica', label: 'Técnica de Carrera', color: 'bg-blue-500' },
  ]

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'stryd':
        return 'bg-orange-500'
      case 'nutricion':
        return 'bg-green-500'
      case 'tecnica':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'stryd':
        return 'Stryd'
      case 'nutricion':
        return 'Nutrición'
      case 'tecnica':
        return 'Técnica'
      default:
        return 'General'
    }
  }

  const filteredPosts =
    selectedCategory === 'todos'
      ? posts
      : posts.filter((post) => post.category === selectedCategory)

  const getImageUrl = (image?: string) => {
    if (!image)
      return 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'
    if (image.startsWith('http')) return image
    return `/api/files/${image}`
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Blog & Noticias</h1>
            <p className="text-xl text-gray-300">
              Artículos sobre entrenamiento, nutrición y tecnología Stryd
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-black/80 sticky top-20 z-40 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                variant={
                  selectedCategory === category.value ? 'default' : 'outline'
                }
                className={
                  selectedCategory === category.value
                    ? `${category.color} hover:opacity-90 text-white font-bold border-none`
                    : 'text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors'
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border-gray-800 shadow-lg hover:shadow-orange-500/10 transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full bg-gray-900 overflow-hidden"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative">
                      <ImageWithFallback
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge
                        className={cn(
                          'absolute top-3 right-3 text-white border-none',
                          getCategoryColor(post.category),
                        )}
                      >
                        {getCategoryLabel(post.category)}
                      </Badge>
                    </div>
                    <div className="p-6 text-white flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                        {post.content}
                      </p>

                      {post.link && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-bold mb-4 w-fit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver Referencia <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author || 'Stryd Panama'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center py-12">
            <p className="text-gray-400 text-lg italic">
              No hay artículos todavía.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-linear-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Recibe artículos exclusivos, tips de entrenamiento y novedades del
            equipo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-white bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-black placeholder:text-white/50"
            />
            <Button
              size="lg"
              className="bg-black hover:bg-gray-900 text-white font-bold px-8 shadow-xl"
            >
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
