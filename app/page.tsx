import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BadgePercent,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Coffee,
  CreditCard,
  Crown,
  Dumbbell,
  Gift,
  HeartPulse,
  MessageCircle,
  PawPrint,
  QrCode,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  TicketPercent,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

const navItems = [
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Industrias', href: '#industrias' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Preguntas', href: '#faq' },
]

const modules = [
  { icon: Star, title: 'Puntos', desc: 'Acumula puntos por compra y por visitas recurrentes.' },
  { icon: TicketPercent, title: 'Cupones', desc: 'Promociones por segmento, fecha o nivel de cliente.' },
  { icon: BadgePercent, title: 'Cashback', desc: 'Recompensas monetizadas para aumentar el ticket promedio.' },
  { icon: Award, title: 'Sellos digitales', desc: 'Tarjetas de frecuencia sin papel para compras repetidas.' },
  { icon: Gift, title: 'Cumpleaños', desc: 'Regalos automáticos en fechas especiales.' },
  { icon: Users, title: 'Referidos', desc: 'Premia a clientes que recomiendan tu negocio.' },
  { icon: Crown, title: 'VIP', desc: 'Niveles, membresías y beneficios exclusivos.' },
  { icon: Wallet, title: 'Wallet', desc: 'Tarjeta digital compatible con Apple Wallet y Google Wallet.' },
]

const benefits = [
  { icon: Zap, title: 'Activa en minutos', desc: 'Crea un programa profesional sin código, sin app obligatoria y sin procesos pesados.' },
  { icon: TrendingUp, title: 'Más retorno', desc: 'Detecta clientes inactivos y lánzales campañas para traerlos de vuelta.' },
  { icon: MessageCircle, title: 'WhatsApp Marketing', desc: 'Envía cupones, recordatorios y recompensas por el canal que tus clientes ya usan.' },
  { icon: ShieldCheck, title: 'Operación confiable', desc: 'Roles, sucursales, integraciones y métricas listas para operar como SaaS real.' },
]

const industries = [
  { icon: Scissors, name: 'Barberías', benefits: ['Corte gratis al décimo sello', 'Referidos con descuento', 'WhatsApp para citas'] },
  { icon: Coffee, name: 'Cafeterías', benefits: ['Bebida gratis', 'Sellos digitales', 'Cumpleaños especial'] },
  { icon: UtensilsCrossed, name: 'Restaurantes', benefits: ['Cashback por consumo', 'Club VIP', 'Campañas por temporada'] },
  { icon: Sparkles, name: 'Salones de belleza', benefits: ['Paquetes recurrentes', 'Regalos de cumpleaños', 'Membresías premium'] },
  { icon: HeartPulse, name: 'Dentistas', benefits: ['Recordatorios por WhatsApp', 'Referidos familiares', 'Crédito por visitas'] },
  { icon: Dumbbell, name: 'Gimnasios', benefits: ['Check-ins con puntos', 'Retos mensuales', 'Membresías VIP'] },
  { icon: PawPrint, name: 'Veterinarias', benefits: ['Puntos por consulta', 'Promos de alimento', 'Cumpleaños de mascota'] },
  { icon: Wrench, name: 'Talleres mecánicos', benefits: ['Club de mantenimiento', 'Diagnóstico gratis', 'Referidos por servicio'] },
]

const steps = [
  { step: '1', title: 'Configura', desc: 'Carga tu marca, define puntos, niveles, cupones y reglas.' },
  { step: '2', title: 'Invita', desc: 'Comparte por WhatsApp, sitio web, QR en caja o redes sociales.' },
  { step: '3', title: 'Recompensa', desc: 'Tus clientes ganan puntos, reciben beneficios y vuelven más seguido.' },
  { step: '4', title: 'Mide', desc: 'Analiza retorno, ventas atribuidas, canjes y clientes activos.' },
]

const plans = [
  {
    name: 'Starter',
    price: '$0',
    badge: 'Inicio ágil',
    desc: 'Para validar tu programa.',
    features: ['100 clientes', 'Puntos y cupones', 'Wallet digital', '1 sucursal'],
  },
  {
    name: 'Growth',
    price: '$29',
    badge: 'Más popular',
    desc: 'Para negocios que quieren crecer.',
    features: ['Clientes ilimitados', 'WhatsApp Marketing', 'Referidos', 'Reportes avanzados'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    badge: 'Multi-sucursal',
    desc: 'Para cadenas y franquicias.',
    features: ['Multi-sucursal', 'Roles y usuarios', 'API e integraciones', 'Onboarding dedicado'],
  },
]

const faqs = [
  { q: '¿Mis clientes necesitan descargar una app?', a: 'No. Pueden ver su wallet desde el navegador y agregarla a Apple Wallet o Google Wallet.' },
  { q: '¿Puedo usar WhatsApp?', a: 'Sí. La plataforma contempla campañas, mensajes por segmento y recordatorios para clientes inactivos.' },
  { q: '¿Funciona con varias sucursales?', a: 'Sí. Puedes configurar sucursales, usuarios, roles y reportes por ubicación.' },
  { q: '¿La plataforma puede operar en más de un idioma?', a: 'Sí. La experiencia puede configurarse para mantener cada pantalla en un solo idioma según la preferencia del negocio.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/86 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-18 md:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_horizontal_2.png"
              alt="INGRESAX REWARDS"
              width={246}
              height={46}
              priority
              className="h-8 max-w-[170px] object-contain md:h-9 md:max-w-none"
            />
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-black/68 transition-colors hover:text-black">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden rounded-full border-black/10 bg-white text-black hover:bg-white md:inline-flex" />
            <Link href="/sign-up">
              <Button className="hidden h-10 rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 sm:inline-flex">
                Solicitar demo
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-6 rounded-full border-black/10 bg-white px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-black/60">
                Plataforma de lealtad para negocios locales
              </Badge>
              <h1 className="text-balance text-5xl font-semibold leading-[0.96] tracking-normal text-black md:text-7xl lg:text-8xl">
                Convierte clientes ocasionales en clientes recurrentes
              </h1>
              <p className="mt-7 max-w-[340px] text-pretty text-lg leading-8 text-black/58 sm:max-w-xl">
                INGRESAX REWARDS ayuda a negocios locales a crear programas de puntos, cupones, referidos, membresías, WhatsApp Marketing y recompensas digitales.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                    Solicitar demo
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <a href="#modulos">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-black/12 bg-white px-7 text-black hover:bg-white">
                    Ver módulos
                  </Button>
                </a>
              </div>
              <div className="mt-10 grid max-w-[340px] grid-cols-3 gap-3 sm:max-w-lg sm:gap-4">
                {[
                  ['68%', 'retorno'],
                  ['12.5K', 'puntos activos'],
                  ['5 min', 'configuración'],
                ].map(([value, label]) => (
                  <div key={label} className="border-t border-black/10 pt-4">
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-black/48">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px] lg:min-h-[650px]">
              <div className="absolute left-1/2 top-6 h-[520px] w-[275px] -translate-x-1/2 rounded-[44px] border-[10px] border-black bg-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] md:h-[610px] md:w-[322px]">
                <div className="absolute left-1/2 top-3 h-7 w-28 -translate-x-1/2 rounded-full bg-primary" />
                <div className="flex h-full flex-col items-center px-7 pb-8 pt-20 text-center">
                  <Image src="/logo_horizontal_2.png" alt="INGRESAX REWARDS" width={184} height={36} className="h-auto w-40 object-contain" />
                  <p className="mt-12 text-xs text-black/45">Tu saldo actual</p>
                  <p className="mt-2 text-5xl font-medium tracking-normal">0</p>
                  <p className="mt-1 text-xs text-black/45">puntos</p>
                  <Button className="mt-8 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ver mis beneficios</Button>
                  <div className="mt-10 w-full text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Nivel</span>
                      <span className="text-black/42">Inicial</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-black/10">
                      <div className="h-full w-0 rounded-full bg-primary" />
                    </div>
                    <p className="mt-3 text-[11px] text-black/45">0 pts registrados</p>
                  </div>
                  <div className="mt-auto grid w-full grid-cols-2 gap-3 text-left">
                    <div className="rounded-lg border border-black/10 p-3">
                      <Gift className="size-4" />
                      <p className="mt-2 text-xs font-medium">Beneficios</p>
                    </div>
                    <div className="rounded-lg border border-black/10 p-3">
                      <QrCode className="size-4" />
                      <p className="mt-2 text-xs font-medium">QR activo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-2 rounded-lg bg-primary p-6 text-primary-foreground shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:left-0 md:w-72">
                <Image src="/logo_horizontal_2.png" alt="INGRESAX REWARDS" width={170} height={34} className="h-auto w-36 brightness-0 invert" />
                <div className="mt-16 flex items-end justify-between">
                  <p className="text-xs text-white/55">VIP CARD</p>
                  <CreditCard className="size-8 text-white/35" />
                </div>
              </div>

              <div className="absolute bottom-10 right-0 h-48 w-36 rounded-[32px] border-[8px] border-brand-gold-soft bg-primary p-4 text-center text-primary-foreground shadow-[0_26px_70px_rgba(15,23,42,0.18)] md:right-8">
                <p className="mt-5 text-[11px] tracking-[0.22em] text-white/70">REWARDS</p>
                <p className="mt-8 text-2xl font-semibold text-brand-gold">0</p>
                <p className="text-[11px] text-white/45">puntos</p>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="rounded-t-[32px] bg-white px-5 py-20 md:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <p className="product-kicker">Beneficios</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Beneficios que elevan tu experiencia.</h2>
            <div className="mt-14 grid gap-5 md:grid-cols-4">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-lg border border-black/8 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-muted/40">
                    <benefit.icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/54">{benefit.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="modulos" className="bg-white px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="product-kicker">Módulos</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-normal">Todo lo que necesita un programa real</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-black/52">Activa puntos, cupones, referidos, membresías y wallet desde un solo panel.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <article key={module.title} className="rounded-lg border border-black/8 bg-muted/30 p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <module.icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-semibold">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/52">{module.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-primary px-5 py-20 text-primary-foreground md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-4xl font-semibold tracking-normal">Así de simple.</h2>
            <div className="mt-14 grid gap-6 md:grid-cols-4">
              {steps.map((item) => (
                <article key={item.step} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-semibold text-white/38">{item.step}</span>
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
                      <CheckCircle2 className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-6 font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="industrias" className="bg-background px-5 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="product-kicker">Industrias</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-normal">Compatible con negocios locales</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry) => (
                <article key={industry.name} className="rounded-lg border border-black/8 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-teal-soft text-brand-ink">
                      <industry.icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{industry.name}</h3>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {industry.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2 text-sm text-black/56">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="planes" className="bg-white px-5 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="product-kicker">Planes</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-normal">Planes listos para vender</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.name} className={`rounded-lg border p-7 ${plan.featured ? 'border-primary bg-primary text-primary-foreground' : 'border-black/8 bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs ${plan.featured ? 'bg-brand-gold text-brand-ink' : 'bg-white text-black/50'}`}>{plan.badge}</span>
                  </div>
                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-semibold">{plan.price}</span>
                    <span className={`pb-2 text-sm ${plan.featured ? 'text-white/45' : 'text-black/42'}`}>/mes</span>
                  </div>
                  <p className={`mt-3 text-sm ${plan.featured ? 'text-white/58' : 'text-black/52'}`}>{plan.desc}</p>
                  <ul className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${plan.featured ? 'text-brand-gold' : 'text-brand-teal'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <Button className={`mt-8 h-11 w-full rounded-full ${plan.featured ? 'bg-white text-black hover:bg-white/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                      Solicitar demo
                    </Button>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-background px-5 py-20 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="product-kicker">Preguntas frecuentes</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-normal">Respuestas claras antes de empezar</h2>
            </div>
            <div className="mt-10 divide-y divide-black/10 rounded-lg border border-black/8 bg-white px-6">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {faq.q}
                    <ChevronDown className="size-4 shrink-0 text-black/38 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-black/55">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 rounded-lg border border-black/8 bg-muted/35 p-8 md:flex-row">
            <div className="flex items-center gap-5">
              <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Lleva INGRESAX REWARDS a tu negocio</h2>
                <p className="mt-1 text-sm text-black/52">Activa tu programa de lealtad con una experiencia digital premium.</p>
              </div>
            </div>
            <Link href="/sign-up">
              <Button className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                Solicitar demo
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/8 bg-white px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Image src="/logo_horizontal_2.png" alt="INGRESAX REWARDS" width={210} height={40} className="h-9 w-auto object-contain" />
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-black/50">
            <Link href="#">Términos y condiciones</Link>
            <Link href="#">Políticas de privacidad</Link>
            <Link href="#">Atención al cliente</Link>
            <Link href="#">Contacto</Link>
          </div>
          <p className="text-sm text-black/40">© 2026 INGRESAX REWARDS</p>
        </div>
      </footer>
    </div>
  )
}
