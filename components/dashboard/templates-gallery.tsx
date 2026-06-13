'use client'

import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Gift,
  Globe,
  MessageCircle,
  Palette,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LandingTemplate = {
  id: string
  name: string
  industry: string
  tone: string
  headline: string
  description: string
  accent: string
  background: string
  foreground: string
  muted: string
  layout: 'split' | 'editorial' | 'compact' | 'bold' | 'clean' | 'local'
  sections: string[]
  rewards: string[]
  services: string[]
  bestFor: string
}

const templates: LandingTemplate[] = [
  {
    id: 'minimal-premium',
    name: 'Minimal Premium',
    industry: 'Retail, membresías y servicios premium',
    tone: 'Elegante / Premium',
    headline: 'Convierte cada visita en una relación duradera',
    description: 'Una landing sobria para negocios que quieren vender confianza, beneficios y membresías VIP.',
    accent: '#c8a45d',
    background: '#f7f7f3',
    foreground: '#111111',
    muted: '#e8e1d2',
    layout: 'split',
    sections: ['Hero', 'Beneficios', 'Niveles VIP', 'Wallet', 'FAQ'],
    rewards: ['Puntos por compra', 'Membresías VIP', 'Cupones exclusivos'],
    services: ['Registro digital', 'Agregar a Wallet', 'WhatsApp Marketing'],
    bestFor: 'Marcas que quieren una presencia sobria y aspiracional.',
  },
  {
    id: 'food-local',
    name: 'Food Local',
    industry: 'Restaurantes, cafeterías y panaderías',
    tone: 'Cálido / Cercano',
    headline: 'Gana puntos en cada antojo',
    description: 'Diseñada para compras frecuentes, combos, cupones por regreso y recompensas de cumpleaños.',
    accent: '#d9572a',
    background: '#fff8ef',
    foreground: '#251a14',
    muted: '#f1d1aa',
    layout: 'editorial',
    sections: ['Menú destacado', 'Puntos', 'Cupones', 'Cumpleaños', 'Sucursales'],
    rewards: ['Sellos digitales', 'Regalo de cumpleaños', 'Cashback en puntos'],
    services: ['Promos por WhatsApp', 'Referidos', 'QR de inscripción'],
    bestFor: 'Negocios con visitas semanales y promociones rápidas.',
  },
  {
    id: 'beauty-studio',
    name: 'Beauty Studio',
    industry: 'Barberías, salones y estética',
    tone: 'Moderno / Visual',
    headline: 'Premia cada cita y cada recomendación',
    description: 'Una landing visual para vender paquetes, referidos y recompensas por servicios recurrentes.',
    accent: '#c24b7a',
    background: '#fff4f8',
    foreground: '#24141b',
    muted: '#f0c7d7',
    layout: 'bold',
    sections: ['Servicios', 'Referidos', 'Niveles', 'Reseñas', 'Agenda'],
    rewards: ['Recompensas por referidos', 'Cupones por visita', 'Paquetes VIP'],
    services: ['Botón WhatsApp', 'Galería de servicios', 'Perfil de cliente'],
    bestFor: 'Negocios donde la recomendación y la recurrencia pesan mucho.',
  },
  {
    id: 'clinic-care',
    name: 'Clinic Care',
    industry: 'Dentistas, clínicas y wellness',
    tone: 'Confiable / Profesional',
    headline: 'Beneficios claros para pacientes recurrentes',
    description: 'Una landing limpia para comunicar planes, seguimiento, recordatorios y beneficios familiares.',
    accent: '#287c89',
    background: '#eef8f7',
    foreground: '#102428',
    muted: '#c7e1df',
    layout: 'clean',
    sections: ['Planes', 'Beneficios', 'Familia', 'Recordatorios', 'Contacto'],
    rewards: ['Membresías familiares', 'Cupones preventivos', 'Puntos por visita'],
    services: ['WhatsApp de seguimiento', 'Wallet del paciente', 'Referidos familiares'],
    bestFor: 'Servicios donde la confianza y la continuidad importan.',
  },
  {
    id: 'fitness-club',
    name: 'Fitness Club',
    industry: 'Gimnasios, estudios y coaches',
    tone: 'Enérgico / Directo',
    headline: 'Sube de nivel dentro y fuera del entrenamiento',
    description: 'Pensada para retos, membresías, rankings y recompensas por constancia.',
    accent: '#5f7c2d',
    background: '#f3f7ec',
    foreground: '#182011',
    muted: '#d5e5ba',
    layout: 'compact',
    sections: ['Retos', 'Niveles', 'Premios', 'Comunidad', 'Planes'],
    rewards: ['Niveles por asistencia', 'Premios por retos', 'Cashback en membresía'],
    services: ['Campañas WhatsApp', 'Ranking mensual', 'Wallet de puntos'],
    bestFor: 'Programas que motivan hábitos y asistencia constante.',
  },
  {
    id: 'local-services',
    name: 'Local Services',
    industry: 'Veterinarias, talleres y servicios locales',
    tone: 'Práctico / Comercial',
    headline: 'Haz que tus clientes vuelvan cuando más te necesitan',
    description: 'Una estructura flexible para servicios con recordatorios, historial, cupones y beneficios por retorno.',
    accent: '#2f66c5',
    background: '#f1f5ff',
    foreground: '#111827',
    muted: '#c9d8f3',
    layout: 'local',
    sections: ['Servicios', 'Historial', 'Cupones', 'Recordatorios', 'Ubicación'],
    rewards: ['Cupones de mantenimiento', 'Puntos por servicio', 'Referidos'],
    services: ['Recordatorios WhatsApp', 'Landing multi-sucursal', 'QR de cliente'],
    bestFor: 'Negocios que dependen de regreso programado y confianza local.',
  },
]

const templateFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'premium', label: 'Premium' },
  { id: 'local', label: 'Locales' },
  { id: 'health', label: 'Salud' },
]

function templateMatchesFilter(template: LandingTemplate, filter: string) {
  if (filter === 'all') return true
  if (filter === 'premium') return template.id === 'minimal-premium' || template.id === 'beauty-studio'
  if (filter === 'local') return template.id === 'food-local' || template.id === 'local-services'
  return template.id === 'clinic-care' || template.id === 'fitness-club'
}

function MiniLandingPreview({ template, large = false }: { template: LandingTemplate; large?: boolean }) {
  return (
    <div
      className={cn('overflow-hidden rounded-lg border border-black/10 shadow-sm', large ? 'min-h-[360px]' : 'aspect-[4/3]')}
      style={{ backgroundColor: template.background, color: template.foreground }}
    >
      <div className={cn('flex items-center justify-between border-b border-black/10', large ? 'px-6 py-4' : 'px-4 py-3')}>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: template.accent }} />
          <span className={cn('font-semibold tracking-[0.14em]', large ? 'text-xs' : 'text-[9px]')}>REWARDS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-black/10" />
          <span className="h-1.5 w-6 rounded-full bg-black/10" />
          <span className="h-1.5 w-10 rounded-full bg-black/10" />
        </div>
      </div>

      <div className={cn('grid gap-4', large ? 'grid-cols-[1.1fr_0.9fr] p-6' : 'p-4')}>
        <div>
          <Badge className="border-black/10 bg-white/60 text-[10px] text-foreground shadow-none" variant="outline">
            {template.tone}
          </Badge>
          <h3 className={cn('mt-3 font-semibold leading-tight tracking-normal', large ? 'text-3xl' : 'text-lg')}>
            {template.headline}
          </h3>
          <p className={cn('mt-2 text-black/60', large ? 'max-w-md text-sm' : 'line-clamp-2 text-[11px]')}>
            {template.description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-md px-3 py-2 text-xs font-semibold text-white" style={{ backgroundColor: template.foreground }}>
              Unirme
            </span>
            <span className="text-xs font-medium" style={{ color: template.accent }}>
              Ver recompensas
            </span>
          </div>
        </div>

        <div className={cn('rounded-lg border border-black/10 bg-white/70 p-3', large ? 'self-start' : 'hidden sm:block')}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">Wallet</span>
            <Wallet className="size-4" style={{ color: template.accent }} />
          </div>
          <div className="mt-3 text-2xl font-semibold">0</div>
          <div className="text-[11px] text-black/50">puntos disponibles</div>
          <div className="mt-4 h-2 rounded-full bg-black/10">
            <div className="h-2 w-0 rounded-full" style={{ backgroundColor: template.accent }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
            {template.rewards.slice(0, 3).map((reward) => (
              <span key={reward} className="rounded-md bg-white px-2 py-2 shadow-sm">
                {reward.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TemplatesGallery() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [previewTemplate, setPreviewTemplate] = useState<LandingTemplate | null>(null)
  const filteredTemplates = templates.filter((template) => templateMatchesFilter(template, selectedFilter))

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Globe, label: 'Landing pública', value: '6 estilos base' },
          { icon: Gift, label: 'Programa integrado', value: 'Puntos, cupones y VIP' },
          { icon: MessageCircle, label: 'Conversión directa', value: 'WhatsApp, QR y Wallet' },
        ].map((item) => (
          <div key={item.label} className="premium-card p-5">
            <item.icon className="size-5 text-brand-teal" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">Biblioteca de landpages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Plantillas generales para publicar beneficios, recompensas, referidos, wallet digital y servicios del negocio.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {templateFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                selectedFilter === filter.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {filteredTemplates.map((template) => (
          <article key={template.id} className="premium-card overflow-hidden">
            <MiniLandingPreview template={template} />

            <div className="space-y-5 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-normal">{template.name}</h3>
                    <Badge variant="outline">{template.tone}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{template.industry}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[template.foreground, template.accent, template.background, template.muted].map((color) => (
                    <span key={color} className="size-5 rounded-md border border-border" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Gift className="size-3.5" />
                    Recompensas
                  </p>
                  <div className="space-y-1.5">
                    {template.rewards.map((item) => (
                      <p key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-3.5 text-brand-teal" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Sparkles className="size-3.5" />
                    Servicios
                  </p>
                  <div className="space-y-1.5">
                    {template.services.map((item) => (
                      <p key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-3.5 text-brand-teal" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Palette className="size-3.5" />
                    Secciones
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.sections.map((section) => (
                      <Badge key={section} variant="secondary">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
                <p className="max-w-md text-sm text-muted-foreground">{template.bestFor}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="size-4" />
                    Vista previa
                  </Button>
                  <Button>
                    Usar plantilla
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="premium-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="product-kicker">Publicación guiada</p>
            <h3 className="mt-2 text-xl font-semibold tracking-normal">Personaliza marca, colores, sucursales y beneficios</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Configura el contenido, la identidad visual, los beneficios y las llamadas a la acción antes de publicar.
            </p>
          </div>
          <Button variant="outline">
            <Users className="size-4" />
            Solicitar diseño personalizado
          </Button>
        </div>
      </div>

      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-lg border border-border bg-card shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <MiniLandingPreview template={previewTemplate} large />
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]">
              <div>
                <h3 className="text-2xl font-semibold tracking-normal">{previewTemplate.name}</h3>
                <p className="mt-2 text-muted-foreground">{previewTemplate.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {previewTemplate.sections.map((section) => (
                    <div key={section} className="rounded-lg border border-border p-4">
                      <p className="font-medium">{section}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Bloque editable para adaptar textos, imágenes y llamadas a la acción.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-semibold">Incluye</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {[...previewTemplate.rewards, ...previewTemplate.services].map((item) => (
                    <p key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand-teal" />
                      {item}
                    </p>
                  ))}
                </div>
                <div className="mt-5 space-y-2">
                  <Button className="w-full">
                    Usar plantilla
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setPreviewTemplate(null)}>
                    Cerrar
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
