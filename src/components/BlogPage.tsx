import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Calendar, User } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: 'nutricion' | 'tecnica' | 'stryd'
  author: string
  date: string
  image: string
  readTime: string
}

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')

  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'Cómo Interpretar tu Critical Power (CP)',
      excerpt:
        'El Critical Power es la métrica más importante del entrenamiento con Stryd. Aprende qué significa y cómo usarlo para estructurar tus entrenos.',
      category: 'stryd',
      author: 'Ricardo Sanjur',
      date: '28 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop',
      readTime: '8 min',
    },
    {
      id: 2,
      title: 'Nutrición Pre-Carrera: Lo Que Funciona',
      excerpt:
        '¿Qué comer antes de una competencia? Estrategias probadas para optimizar tu energía sin problemas gastrointestinales.',
      category: 'nutricion',
      author: 'Dra. Ana López',
      date: '25 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop',
      readTime: '6 min',
    },
    {
      id: 3,
      title: '5 Ejercicios de Técnica de Carrera Esenciales',
      excerpt:
        'Mejora tu economía de carrera con estos ejercicios técnicos que puedes incorporar en tu calentamiento habitual.',
      category: 'tecnica',
      author: 'Ricardo Sanjur',
      date: '22 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=500&fit=crop',
      readTime: '5 min',
    },
    {
      id: 4,
      title: 'RSS vs TSS: Entendiendo la Carga de Entrenamiento',
      excerpt:
        'Running Stress Score es clave para balancear tu entrenamiento. Descubre cómo usarlo para prevenir sobreentrenamiento.',
      category: 'stryd',
      author: 'Ricardo Sanjur',
      date: '18 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=500&fit=crop',
      readTime: '10 min',
    },
    {
      id: 5,
      title: 'Hidratación Inteligente para Corredores',
      excerpt:
        'No solo es beber agua. Aprende a calcular tus necesidades de hidratación y electrolitos según la intensidad y duración.',
      category: 'nutricion',
      author: 'Dra. Ana López',
      date: '15 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop',
      readTime: '7 min',
    },
    {
      id: 6,
      title: 'Zonas de Potencia: Guía Completa',
      excerpt:
        'De recuperación a VO2max, cada zona de potencia tiene un propósito. Aprende cuándo y cómo entrenar en cada una.',
      category: 'stryd',
      author: 'Ricardo Sanjur',
      date: '12 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=500&fit=crop',
      readTime: '12 min',
    },
    {
      id: 7,
      title: 'Cadencia Óptima: Mito vs Realidad',
      excerpt:
        '¿Realmente necesitas correr a 180 pasos por minuto? Lo que la ciencia dice sobre la cadencia ideal.',
      category: 'tecnica',
      author: 'Ricardo Sanjur',
      date: '08 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=500&fit=crop',
      readTime: '6 min',
    },
    {
      id: 8,
      title: 'Suplementación para Corredores de Fondo',
      excerpt:
        '¿Qué suplementos valen la pena? Una revisión basada en evidencia de los suplementos más efectivos para runners.',
      category: 'nutricion',
      author: 'Dra. Ana López',
      date: '05 Ene 2026',
      image:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop',
      readTime: '9 min',
    },
  ]

  const categories = [
    { value: 'todos', label: 'Todos los Artículos', color: 'bg-gray-500' },
    { value: 'stryd', label: 'Novedades Stryd', color: 'bg-orange-500' },
    { value: 'nutricion', label: 'Nutrición', color: 'bg-green-500' },
    { value: 'tecnica', label: 'Técnica de Carrera', color: 'bg-blue-500' },
  ]

  const getCategoryColor = (category: BlogPost['category']) => {
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

  const getCategoryLabel = (category: BlogPost['category']) => {
    switch (category) {
      case 'stryd':
        return 'Stryd'
      case 'nutricion':
        return 'Nutrición'
      case 'tecnica':
        return 'Técnica'
      default:
        return category
    }
  }

  const filteredPosts =
    selectedCategory === 'todos'
      ? posts
      : posts.filter((post) => post.category === selectedCategory)

  return (
    <div className="bg-white min-h-screen">
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
      <section className="py-8 bg-gray-50 sticky top-20 z-40 border-b">
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
                    ? `${category.color} hover:opacity-90 text-white`
                    : 'text-gray-700 hover:bg-gray-200'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={post.image}
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
                  <div className="p-6 text-black">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      ⏱️ {post.readTime} de lectura
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay artículos en esta categoría.
              </p>
            </div>
          )}
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
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-none outline-none focus:ring-2 focus:ring-black"
            />
            <Button
              size="lg"
              className="bg-black hover:bg-gray-900 text-white font-bold"
            >
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
