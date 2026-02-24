import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    titulo: '',
    descripcion: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          titulo: '',
          descripcion: '',
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">
            Contáctanos
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
            ¿Tienes alguna duda o quieres unirte al equipo? Estamos aquí para
            ayudarte a alcanzar tu máximo potencial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800 shadow-2xl p-8 rounded-3xl">
              {status === 'success' ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    ¡MENSAJE ENVIADO!
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Tu mensaje ha sido recibido exitosamente. Nos pondremos en
                    contacto contigo lo antes posible.
                  </p>
                  <Button
                    onClick={() => setStatus('idle')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 rounded-xl"
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="nombre"
                        className="text-gray-400 uppercase text-xs font-black tracking-widest"
                      >
                        Nombre Completo
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 h-12 rounded-xl"
                        placeholder="Tu nombre aquí"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-400 uppercase text-xs font-black tracking-widest"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 h-12 rounded-xl"
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="telefono"
                        className="text-gray-400 uppercase text-xs font-black tracking-widest"
                      >
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 h-12 rounded-xl"
                        placeholder="6000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="titulo"
                        className="text-gray-400 uppercase text-xs font-black tracking-widest"
                      >
                        Asunto / Título
                      </Label>
                      <Input
                        id="titulo"
                        name="titulo"
                        required
                        value={formData.titulo}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 h-12 rounded-xl"
                        placeholder="¿De qué trata tu mensaje?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="descripcion"
                      className="text-gray-400 uppercase text-xs font-black tracking-widest"
                    >
                      Mensaje / Descripción
                    </Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      required
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 min-h-[150px] rounded-xl p-4"
                      placeholder="Escribe aquí los detalles..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-8 rounded-2xl text-xl shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Send className="w-6 h-6" />
                        <span>ENVIAR MENSAJE</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Información
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0 shadow-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">
                      Llámanos
                    </p>
                    <a
                      href="tel:66714646"
                      className="text-white text-lg font-bold hover:text-orange-500 transition-colors"
                    >
                      6671-4646
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0 shadow-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">
                      Escríbenos
                    </p>
                    <a
                      href="mailto:gerencia@ricardosanjur.com"
                      className="text-white text-xl font-bold hover:text-blue-500 transition-colors break-all"
                    >
                      gerencia@ricardosanjur.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">
                      Ubicación
                    </p>
                    <p className="text-white text-xl font-bold">
                      Panamá City, Panamá
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-12 mt-12 border-t border-gray-800">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-6">
                  Redes Sociales
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/strydpanama?igsh=aGRwbHVqajc3d2J6"
                    target="_blank"
                    className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white hover:bg-orange-500 transition-all hover:scale-110"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1bfxKxzJxo/"
                    target="_blank"
                    className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white hover:bg-blue-600 transition-all hover:scale-110"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://wa.me/50766714646"
                    target="_blank"
                    className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white hover:bg-green-500 transition-all hover:scale-110"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </Card>

            <Card className="bg-orange-500 p-8 rounded-3xl shadow-xl overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
              <h4 className="text-2xl font-black text-white mb-4 relative z-10">
                ¿LISTO PARA CORRER?
              </h4>
              <p className="text-white/90 font-medium mb-6 relative z-10 leading-relaxed">
                Únete al equipo líder en tecnología Stryd en Panamá.
              </p>
              <a
                href="/unete"
                className="inline-block bg-white text-orange-500 font-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-all relative z-10 shadow-lg"
              >
                ÚNETE AL TEAM
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
