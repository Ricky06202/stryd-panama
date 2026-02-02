import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Product {
  id: number
  name: string
  price: string
  description: string
  image: string
  category: 'hardware' | 'accesorios' | 'ropa'
}

export function StorePage() {
  const products: Product[] = [
    {
      id: 1,
      name: 'Stryd Next Gen',
      price: '$249.00',
      description:
        'El medidor de potencia para correr más avanzado del mundo. Con compensación de viento y sensores de nueva generación.',
      image:
        'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=800&fit=crop',
      category: 'hardware',
    },
    {
      id: 2,
      name: 'PowerCenter Premium',
      price: '$9.99/mes',
      description:
        'Acceso completo a analíticas avanzadas, planes de entrenamiento personalizados y predicciones de carrera.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop',
      category: 'hardware',
    },
    {
      id: 3,
      name: 'Clip de Repuesto',
      price: '$15.00',
      description:
        'Clip de alta resistencia para asegurar tu Stryd a cualquier tipo de calzado de running.',
      image:
        'https://images.unsplash.com/photo-1591130901021-39e99395f3as?w=800&h=800&fit=crop',
      category: 'accesorios',
    },
    {
      id: 4,
      name: 'Camiseta Team Stryd PA',
      price: '$25.00',
      description:
        'Camiseta técnica transpirable de alta calidad con el diseño oficial del Team Stryd Panamá.',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      category: 'ropa',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-6">
              Equípate con lo <span className="text-orange-500">Mejor</span>
            </h1>
            <p className="text-xl text-gray-300">
              Lleva tu entrenamiento al siguiente nivel con la tecnología líder
              en potencia para correr.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <Card
                key={product.id}
                className="border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white border-none py-1 px-3">
                      {product.price}
                    </Badge>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed h-20 overflow-hidden">
                      {product.description}
                    </p>
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                        Comprar Ahora
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-xl border-2 border-gray-100 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all"
                        onClick={() =>
                          window.open(
                            `https://wa.me/50769001234?text=Hola, me interesa el producto: ${product.name}`,
                            '_blank',
                          )
                        }
                      >
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Envío a Todo Panamá</h4>
              <p className="text-gray-600">
                Recibe tu equipo en la puerta de tu casa u oficina.
              </p>
            </div>
            <div>
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Asesoría Preventa</h4>
              <p className="text-gray-600">
                ¿Tienes dudas? Chatea con nuestros expertos por WhatsApp.
              </p>
            </div>
            <div>
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Badge className="bg-orange-600 text-white border-none p-2 rounded-lg">
                  Stryd
                </Badge>
              </div>
              <h4 className="text-xl font-bold mb-2">Garantía Oficial</h4>
              <p className="text-gray-600">
                Somos distribuidores autorizados en la región.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
