import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

export function JoinTeamPage() {
  const [step, setStep] = useState(1)
  const [isAlreadyMember, setIsAlreadyMember] = useState<boolean | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de envío de datos
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-orange-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white">¡Recibido!</h2>
          </div>
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">
                Tu solicitud está siendo procesada
              </p>
              <p className="text-gray-600 leading-relaxed">
                Estamos revisando tu información para darte la mejor bienvenida al equipo. 
                Una vez que tu solicitud sea aprobada, recibirás un correo electrónico con todos los detalles para comenzar.
              </p>
            </div>
            <div className="pt-4">
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 font-bold px-8 py-6 rounded-xl"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {/* <img
              src="/favicon.svg"
              alt="Stryd Panamá"
              className="h-24 w-auto drop-shadow-lg"
            /> */}
          </div>
          <h1 className="text-4xl font-black text-gray-900">Stryd Panamá</h1>
          <p className="text-gray-600 leading-relaxed text-lg bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            Grupo de corredores que entrenan con Stryd Panamá. Muchas gracias
            por considerar mi asesoría para tu proceso de entrenamiento
            personalizado. Mi nombre es Ricardo Sanjur entrenador certificado de
            Stryd. Mi objetivo es ofrecer una asesoría de calidad a cada uno de
            los participantes, adaptándome a sus necesidades y metas
            específicas. Estoy comprometido a brindarte el apoyo necesario para
            que puedas alcanzar tus objetivos de manera efectiva y segura.
            Juntos, trabajaremos en un plan de entrenamiento que se ajuste a tus
            capacidades y te motive a superarte cada día.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pregunta Inicial de Membresía */}
          <Card className="border-none shadow-lg overflow-hidden bg-orange-50 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label className="text-xl font-bold text-gray-900">
                  ¿Ya formas parte del equipo StrydPanama?
                </Label>
                <RadioGroup
                  onValueChange={(val) => setIsAlreadyMember(val === 'si')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="member_si" className="w-5 h-5" />
                    <Label htmlFor="member_si" className="text-lg cursor-pointer">Sí, ya soy miembro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="member_no" className="w-5 h-5" />
                    <Label htmlFor="member_no" className="text-lg cursor-pointer">Quiero unirme al equipo</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Información del Atleta */}
          {isAlreadyMember !== null ? (
            <div className="space-y-8 animate-in fade-in duration-700">
              <Section title="Información del Atleta">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Nombre Completo" id="nombre" />
                  <FormField label="Cédula" id="cedula" />
                  <div className="space-y-2">
                    <Label htmlFor="foto" className="text-base font-bold text-gray-900">Foto</Label>
                    <Input id="foto" type="file" className="cursor-pointer" />
                  </div>
                  <FormField
                    label="Fecha de Nacimiento"
                    id="fecha_nac"
                    type="date"
                  />
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-900">Genero</Label>
                    <RadioGroup defaultValue="otro">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculino" id="masc" />
                        <Label htmlFor="masc">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femenino" id="fem" />
                        <Label htmlFor="fem">Femenino</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <FormField label="Provincia donde vive" id="provincia" />
                  <FormField
                    label="Correo electrónico"
                    id="email"
                    type="email"
                  />
                  <FormField
                    label="Número de teléfono móvil"
                    id="tel"
                    type="tel"
                  />
                  <FormField
                    label="Contraseña"
                    id="password"
                    type="password"
                  />
                  <FormField
                    label="Confirmar Contraseña"
                    id="confirm_password"
                    type="password"
                  />
                </div>
              </Section>

              {/* Section 2: Salud */}
              <Section title="Salud">
                <div className="space-y-6">
                  <FormField label="Tipo de Sangre" id="sangre" />
                  <FormField
                    label="¿El atleta tiene alguna alergia?"
                    id="alergia"
                  />
                  <FormField
                    label="¿El atleta tiene historial de alguna enfermedad? ¿Cuál?"
                    id="enfermedad"
                  />
                  <FormField
                    label="¿Lesiones en el pasado?"
                    id="lesiones_pas"
                  />
                  <FormField label="¿Lesiones actuales?" id="lesiones_act" />
                </div>
              </Section>

              {/* Section 3: Composición corporal */}
              <Section title="Composición corporal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Estatura (cm)"
                    id="estatura"
                    type="number"
                  />
                  <FormField
                    label="¿Cuál es tu peso? (libras)"
                    id="peso"
                    type="number"
                  />
                  <FormField label="% Grasa" id="grasa" type="number" />
                  <FormField label="Tipo de Pisada?" id="pisada" />
                </div>
              </Section>

              {/* Section 4: Records Personales */}
              <Section title="Records Personales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="5k (Tiempo)" id="record_5k" />
                  <FormField label="10k (Tiempo)" id="record_10k" />
                  <FormField label="21k (Tiempo)" id="record_21k" />
                  <FormField label="42k (Tiempo)" id="record_42k" />
                  <FormField label="W/kg (Vatios por kilo)" id="record_wkg" />
                  <FormField label="Nombre de usuario en Stryd" id="user_stryd" />
                  <FormField label="Nombre de usuario en FinalSurge" id="user_finalsurge" />
                  <FormField label="Fecha de inicio en el equipo" id="fecha_inicio" type="date" />
                </div>
              </Section>

              {/* Section 5: Objetivos */}
              {isAlreadyMember === false && (
                <Section title="Objetivos">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-gray-900">
                        ¿Para qué entrenas?
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {[
                          'Bajar de Peso',
                          'Estar Saludable',
                          'Ganar Fuerza',
                          'Mejorar tiempos',
                          'Ser mi mejor versión',
                        ].map((obj) => (
                          <div
                            key={obj}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox id={obj} />
                            <Label htmlFor={obj} className="cursor-pointer">
                              {obj}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <FormField
                      label="Objetivos a Corto Plazo (1 año)"
                      id="obj_corto"
                    />
                    <FormField
                      label="Objetivo a mediano Plazo (3 años)"
                      id="obj_medio"
                    />
                    <FormField
                      label="Objetivo a Largo Plazo (5+ años)"
                      id="obj_largo"
                    />
                  </div>
                </Section>
              )}

              {/* Section 6: Plan de Entreno (Solo nuevos) */}
              {isAlreadyMember === false && (
                <Section title="Plan de Entreno">
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-900">
                      ¿Cuántos días a la semana te gustaría entrenar?
                    </Label>
                    <RadioGroup className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { v: '4', l: '4 días' },
                        { v: '5', l: '5 días' },
                        { v: '6', l: '6 días' },
                        { v: '7', l: '7 días' },
                      ].map((opt) => (
                        <div
                          key={opt.v}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                          <RadioGroupItem value={opt.v} id={`plan_${opt.v}`} />
                          <Label htmlFor={`plan_${opt.v}`} className="flex-1 cursor-pointer font-medium">
                            {opt.l}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Section>
              )}

              {/* Section 7: Preguntas Varias */}
              <Section title="Preguntas Varias">
                <div className="space-y-6">
                  {isAlreadyMember === false && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">¿Ha entrenado antes con Stryd?</Label>
                        <RadioGroup className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="si" id="stryd_si" />
                            <Label htmlFor="stryd_si">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="stryd_no" />
                            <Label htmlFor="stryd_no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">¿Ha realizado entrenamiento estructurado?</Label>
                        <RadioGroup className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="si" id="est_si" />
                            <Label htmlFor="est_si">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="est_no" />
                            <Label htmlFor="est_no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">
                          ¿Realiza actualmente entrenamiento de fuerza? (pesas o
                          con peso corporal)
                        </Label>
                        <RadioGroup className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="si" id="fuerza_si" />
                            <Label htmlFor="fuerza_si">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="fuerza_no" />
                            <Label htmlFor="fuerza_no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">
                          Nivel de actividad (últimos 4 meses)
                        </Label>
                        <RadioGroup className="space-y-2">
                          {[
                            { v: 'sedentario', l: 'Sedentario: No me ejercito' },
                            { v: 'poco', l: 'Poco: 1 o 2 veces por semana' },
                            { v: 'medio', l: 'Medio: 3 o 4 veces por semana' },
                            { v: 'alto', l: 'Alto: 5 a 7 veces por semana' },
                          ].map((opt) => (
                            <div
                              key={opt.v}
                              className="flex items-center space-x-2 p-2 border rounded-md hover:bg-orange-50 transition-colors"
                            >
                              <RadioGroupItem value={opt.v} id={opt.v} />
                              <Label
                                htmlFor={opt.v}
                                className="flex-1 cursor-pointer"
                              >
                                {opt.l}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-900">
                      Marca de Reloj
                    </Label>
                    <RadioGroup className="grid grid-cols-2 gap-2">
                      {[
                        'Garmin',
                        'Polar',
                        'Suunto',
                        'Coros',
                        'Samsung',
                        'Android Wear',
                        'Fitbit',
                      ].map((marca) => (
                        <div
                          key={marca}
                          className="flex items-center space-x-2 p-2 border rounded-md"
                        >
                          <RadioGroupItem
                            value={marca.toLowerCase()}
                            id={marca}
                          />
                          <Label htmlFor={marca}>{marca}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {isAlreadyMember === false && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">
                          ¿Qué distancia(s) le llaman la atención?
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            '5km',
                            '10km',
                            '15km',
                            '21km - Media Maratón',
                            '42.2km - Maratón',
                          ].map((dist) => (
                            <div
                              key={dist}
                              className="flex items-center space-x-2 p-2 border rounded-md"
                            >
                              <Checkbox id={dist} />
                              <Label htmlFor={dist}>{dist}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-900">
                          Nivel de Actividad en el Trabajo
                        </Label>
                        <RadioGroup className="space-y-2">
                          {[
                            { v: 'poca', l: 'Poca: Trabajo de escritorio' },
                            { v: 'media', l: 'Media: Me muevo mucho, camino, etc' },
                            {
                              v: 'fuerte',
                              l: 'Fuerte: Estoy en campo, levanto objetos pesados, etc',
                            },
                          ].map((opt) => (
                            <div
                              key={opt.v}
                              className="flex items-center space-x-2 p-2 border rounded-md"
                            >
                              <RadioGroupItem value={opt.v} id={`work_${opt.v}`} />
                              <Label
                                htmlFor={`work_${opt.v}`}
                                className="flex-1 cursor-pointer"
                              >
                                {opt.l}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8 italic">
              Por favor responde la pregunta al inicio del formulario para continuar.
            </p>
          )}

      {isAlreadyMember !== null && (
        <div className="flex justify-center pt-6">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 py-8 text-xl rounded-2xl shadow-xl shadow-orange-500/20 transform hover:scale-105 transition-all">
            {isAlreadyMember ? "Registrar el perfil" : "Enviar Solicitud"}
          </Button>
        </div>
      )}
    </form>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="bg-orange-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <CardContent className="p-8 bg-white">{children}</CardContent>
    </Card>
  )
}

function FormField({
  label,
  id,
  type = 'text',
}: {
  label: string
  id: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-bold text-gray-900">
        {label}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          className="focus-visible:ring-orange-500 min-h-[100px]"
        />
      ) : (
        <Input
          id={id}
          type={type}
          className="focus-visible:ring-orange-500 h-11"
        />
      )}
    </div>
  )
}
