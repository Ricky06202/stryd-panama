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

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/favicon.svg"
              alt="Stryd Panamá"
              className="h-24 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Stryd Panamá 🇵🇦</h1>
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

        <form className="space-y-8">
          {/* Section 1: Información del Atleta */}
          <Section title="Información del Atleta">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="1. Nombre Completo" id="nombre" />
              <FormField label="2. Cédula" id="cedula" />
              <div className="space-y-2">
                <Label htmlFor="foto">3. Foto</Label>
                <Input id="foto" type="file" className="cursor-pointer" />
              </div>
              <FormField
                label="4. Fecha de Nacimiento"
                id="fecha_nac"
                type="date"
              />
              <div className="space-y-3">
                <Label>5. Genero</Label>
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
              <FormField label="6. Provincia donde vive" id="provincia" />
              <FormField
                label="7. Correo electrónico"
                id="email"
                type="email"
              />
              <FormField
                label="8. Número de teléfono móvil"
                id="tel"
                type="tel"
              />
            </div>
          </Section>

          {/* Section 2: Salud */}
          <Section title="Salud">
            <div className="space-y-6">
              <FormField label="9. Tipo de Sangre" id="sangre" />
              <FormField
                label="10. ¿El atleta tiene alguna alergia?"
                id="alergia"
              />
              <FormField
                label="11. ¿El atleta tiene historial de alguna enfermedad? ¿Cuál?"
                id="enfermedad"
              />
              <FormField
                label="12. ¿Lesiones en el pasado?"
                id="lesiones_pas"
              />
              <FormField label="13. ¿Lesiones actuales?" id="lesiones_act" />
            </div>
          </Section>

          {/* Section 3: Composición corporal */}
          <Section title="Composición corporal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="14. Estatura (cm)"
                id="estatura"
                type="number"
              />
              <FormField
                label="15. ¿Cuál es tu peso? (libras)"
                id="peso"
                type="number"
              />
              <FormField label="16. % Grasa" id="grasa" type="number" />
              <FormField label="17. Tipo de Pisada?" id="pisada" />
            </div>
          </Section>

          {/* Section 4: Objetivos */}
          <Section title="Objetivos">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-bold">
                  18. ¿Para qué entrenas?
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
                label="19. Objetivos a Corto Plazo (1 año)"
                id="obj_corto"
              />
              <FormField
                label="20. Objetivo a mediano Plazo (3 años)"
                id="obj_medio"
              />
              <FormField
                label="21. Objetivo a Largo Plazo (5+ años)"
                id="obj_largo"
              />
            </div>
          </Section>

          {/* Section 5: Preguntas Varias */}
          <Section title="Preguntas Varias">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>22. ¿Ha entrenado antes con Stryd?</Label>
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
              <FormField
                label="23. Nombre de Usuario de Stryd"
                id="stryd_user"
              />
              <div className="space-y-3">
                <Label>24. ¿Ha realizado entrenamiento estructurado?</Label>
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
                <Label>
                  25. ¿Realiza actualmente entrenamiento de fuerza? (pesas o con
                  peso corporal)
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
                <Label className="text-lg font-bold">
                  26. Nivel de actividad (últimos 4 meses)
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
                      <Label htmlFor={opt.v} className="flex-1 cursor-pointer">
                        {opt.l}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-bold">27. Marca de Reloj</Label>
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
                      <RadioGroupItem value={marca.toLowerCase()} id={marca} />
                      <Label htmlFor={marca}>{marca}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-bold">
                  28. ¿Qué distancia(s) le llaman la atención?
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
                <Label className="text-lg font-bold">
                  29. Nivel de Actividad en el Trabajo
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
          </Section>

          <div className="flex justify-center pt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 py-8 text-xl rounded-2xl shadow-xl shadow-orange-500/20 transform hover:scale-105 transition-all">
              Enviar Solicitud
            </Button>
          </div>
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
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
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
