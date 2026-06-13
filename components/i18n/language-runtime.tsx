'use client'

import { useEffect } from 'react'

const LOCALE_STORAGE_KEY = 'ingresax.locale'
const LOCALE_COOKIE_KEY = 'ingresax_locale'

type Locale = 'es' | 'en'

const originalTextNodes = new WeakMap<Text, string>()
const missingTranslations = new Set<string>()

const dictionary: Record<string, string> = {
  'Plataforma de lealtad para negocios locales': 'Loyalty platform for local businesses',
  Beneficios: 'Benefits',
  Módulos: 'Modules',
  Industrias: 'Industries',
  'Cómo funciona': 'How it works',
  Planes: 'Plans',
  Preguntas: 'Questions',
  'Solicitar demo': 'Request demo',
  'Convierte clientes ocasionales en clientes recurrentes': 'Turn occasional customers into returning customers',
  'INGRESAX REWARDS ayuda a negocios locales a crear programas de puntos, cupones, referidos, membresías, WhatsApp Marketing y recompensas digitales.':
    'INGRESAX REWARDS helps local businesses create points programs, coupons, referrals, memberships, WhatsApp marketing and digital rewards.',
  'Ver módulos': 'View modules',
  retorno: 'return',
  'puntos activos': 'active points',
  configuración: 'setup',
  'Tu saldo actual': 'Current balance',
  puntos: 'points',
  'Ver mis beneficios': 'View my benefits',
  'Nivel Oro': 'Gold tier',
  Oro: 'Gold',
  '7,440 / 15,000 pts para Nivel Platino': '7,440 / 15,000 pts to Platinum tier',
  '4 premios': '4 rewards',
  'QR activo': 'Active QR',
  'Beneficios que elevan tu experiencia.': 'Benefits that elevate your experience.',
  'Activa en minutos': 'Launch in minutes',
  'Crea un programa profesional sin código, sin app obligatoria y sin procesos pesados.':
    'Create a professional program with no code, no required app and no heavy process.',
  'Más retorno': 'Higher return',
  'Detecta clientes inactivos y lánzales campañas para traerlos de vuelta.':
    'Find inactive customers and launch campaigns to bring them back.',
  'WhatsApp Marketing': 'WhatsApp Marketing',
  'Envía cupones, recordatorios y recompensas por el canal que tus clientes ya usan.':
    'Send coupons, reminders and rewards through the channel your customers already use.',
  'Operación confiable': 'Reliable operations',
  'Roles, sucursales, integraciones y métricas listas para operar como SaaS real.':
    'Roles, locations, integrations and metrics ready to run as a real SaaS platform.',
  'Todo lo que necesita un programa real': 'Everything a real program needs',
  'Activa puntos, cupones, referidos, membresías y wallet desde un solo panel.':
    'Enable points, coupons, referrals, memberships and wallet from one panel.',
  Puntos: 'Points',
  Cupones: 'Coupons',
  Cashback: 'Cashback',
  'Sellos digitales': 'Digital stamps',
  Cumpleaños: 'Birthdays',
  Referidos: 'Referrals',
  Wallet: 'Wallet',
  'Acumula puntos por compra y por visitas recurrentes.': 'Earn points for purchases and repeat visits.',
  'Promociones por segmento, fecha o nivel de cliente.': 'Promotions by segment, date or customer tier.',
  'Recompensas monetizadas para aumentar el ticket promedio.': 'Monetized rewards to increase average order value.',
  'Tarjetas de frecuencia sin papel para compras repetidas.': 'Paperless frequency cards for repeat purchases.',
  'Regalos automáticos en fechas especiales.': 'Automatic gifts on special dates.',
  'Premia a clientes que recomiendan tu negocio.': 'Reward customers who recommend your business.',
  'Niveles, membresías y beneficios exclusivos.': 'Tiers, memberships and exclusive benefits.',
  'Tarjeta digital compatible con Apple Wallet y Google Wallet.': 'Digital card compatible with Apple Wallet and Google Wallet.',
  'Así de simple.': 'That simple.',
  Configura: 'Configure',
  Invita: 'Invite',
  Recompensa: 'Reward',
  Mide: 'Measure',
  'Carga tu marca, define puntos, niveles, cupones y reglas.': 'Upload your brand and define points, tiers, coupons and rules.',
  'Comparte por WhatsApp, sitio web, QR en caja o redes sociales.': 'Share through WhatsApp, your website, checkout QR or social media.',
  'Tus clientes ganan puntos, reciben beneficios y vuelven más seguido.':
    'Your customers earn points, receive benefits and come back more often.',
  'Analiza retorno, ventas atribuidas, canjes y clientes activos.': 'Analyze return, attributed sales, redemptions and active customers.',
  'Compatible con negocios locales': 'Compatible with local businesses',
  Barberías: 'Barbershops',
  Cafeterías: 'Coffee shops',
  Restaurantes: 'Restaurants',
  'Salones de belleza': 'Beauty salons',
  Dentistas: 'Dentists',
  Gimnasios: 'Gyms',
  Veterinarias: 'Veterinary clinics',
  'Talleres mecánicos': 'Auto repair shops',
  'Corte gratis al décimo sello': 'Free cut on the tenth stamp',
  'Referidos con descuento': 'Discounted referrals',
  'WhatsApp para citas': 'WhatsApp for appointments',
  'Bebida gratis': 'Free drink',
  'Cumpleaños especial': 'Special birthday reward',
  'Cashback por consumo': 'Cashback on purchases',
  'Club VIP': 'VIP club',
  'Campañas por temporada': 'Seasonal campaigns',
  'Paquetes recurrentes': 'Recurring packages',
  'Regalos de cumpleaños': 'Birthday gifts',
  'Membresías premium': 'Premium memberships',
  'Recordatorios por WhatsApp': 'WhatsApp reminders',
  'Referidos familiares': 'Family referrals',
  'Crédito por visitas': 'Visit credit',
  'Check-ins con puntos': 'Points check-ins',
  'Retos mensuales': 'Monthly challenges',
  'Membresías VIP': 'VIP memberships',
  'Puntos por consulta': 'Points per visit',
  'Promos de alimento': 'Food promotions',
  'Cumpleaños de mascota': 'Pet birthday',
  'Club de mantenimiento': 'Maintenance club',
  'Diagnóstico gratis': 'Free diagnosis',
  'Referidos por servicio': 'Service referrals',
  'Planes listos para vender': 'Plans ready to sell',
  'Inicio ágil': 'Lean start',
  'Más popular': 'Most popular',
  'Multi-sucursal': 'Multi-location',
  'Para validar tu programa.': 'To validate your program.',
  'Para negocios que quieren crecer.': 'For businesses ready to grow.',
  'Para cadenas y franquicias.': 'For chains and franchises.',
  '100 clientes': '100 customers',
  'Puntos y cupones': 'Points and coupons',
  'Wallet digital': 'Digital wallet',
  '1 sucursal': '1 location',
  'Clientes ilimitados': 'Unlimited customers',
  'Reportes avanzados': 'Advanced reports',
  'Roles y usuarios': 'Roles and users',
  'API e integraciones': 'API and integrations',
  'Onboarding dedicado': 'Dedicated onboarding',
  'Preguntas frecuentes': 'Frequently asked questions',
  'Respuestas claras antes de empezar': 'Clear answers before getting started',
  '¿Mis clientes necesitan descargar una app?': 'Do my customers need to download an app?',
  'No. Pueden ver su wallet desde el navegador y agregarla a Apple Wallet o Google Wallet.':
    'No. They can view their wallet in the browser and add it to Apple Wallet or Google Wallet.',
  '¿Puedo usar WhatsApp?': 'Can I use WhatsApp?',
  'Sí. La plataforma contempla campañas, mensajes por segmento y recordatorios para clientes inactivos.':
    'Yes. The platform supports campaigns, segmented messages and reminders for inactive customers.',
  '¿Funciona con varias sucursales?': 'Does it work with multiple locations?',
  'Sí. Puedes configurar sucursales, usuarios, roles y reportes por ubicación.':
    'Yes. You can configure locations, users, roles and reports by location.',
  '¿La plataforma puede operar en más de un idioma?': 'Can the platform operate in more than one language?',
  'Sí. La experiencia puede configurarse para mantener cada pantalla en un solo idioma según la preferencia del negocio.':
    'Yes. The experience can be configured to keep each screen in a single language based on the business preference.',
  'Lleva INGRESAX REWARDS a tu negocio': 'Bring INGRESAX REWARDS to your business',
  'Activa tu programa de lealtad con una experiencia digital premium.':
    'Launch your loyalty program with a premium digital experience.',
  'Términos y condiciones': 'Terms and conditions',
  'Políticas de privacidad': 'Privacy policy',
  'Atención al cliente': 'Customer support',
  Contacto: 'Contact',

  'Buscar clientes, recompensas, campañas...': 'Search customers, rewards, campaigns...',
  'Cambiar idioma': 'Change language',
  Español: 'English',
  'Plan premium': 'Premium plan',
  'Espacio de trabajo': 'Workspace',
  'Administrador INGRESAX': 'INGRESAX Admin',
  'Cerrar sesión': 'Sign out',
  'Panel principal': 'Main dashboard',
  'Resumen principal': 'Main summary',
  'Clientes, recompensas, ventas atribuidas y retorno en tiempo real.':
    'Customers, rewards, attributed sales and return rate in real time.',
  'Sucursal activa:': 'Active location:',
  'Matriz Roma Norte': 'Roma Norte headquarters',
  'Total de clientes registrados': 'Registered customers',
  'Clientes activos': 'Active customers',
  'Recompensas emitidas': 'Rewards issued',
  'Recompensas canjeadas': 'Rewards redeemed',
  'Ventas atribuidas': 'Attributed sales',
  'Tasa de retorno': 'Return rate',
  'vs mes anterior': 'vs previous month',
  'Crecimiento mensual': 'Monthly growth',
  'Clientes registrados y ventas atribuidas': 'Registered customers and attributed sales',
  'Tabla de actividad reciente': 'Recent activity table',
  'Ventas, puntos, canjes y mensajes': 'Sales, points, redemptions and messages',
  Cliente: 'Customer',
  Actividad: 'Activity',
  Canal: 'Channel',
  Valor: 'Value',
  Estado: 'Status',
  Fecha: 'Date',
  'Acciones rápidas': 'Quick actions',
  'Operaciones frecuentes del negocio': 'Frequent business operations',
  'Agregar cliente': 'Add customer',
  'Crear recompensa': 'Create reward',
  'Lanzar campaña': 'Launch campaign',
  'Enviar WhatsApp': 'Send WhatsApp',
  'Emitir wallet': 'Issue wallet',
  'Ver reportes': 'View reports',
  'Registra WhatsApp, email y nivel': 'Register WhatsApp, email and tier',
  'Configura puntos, cupón o cashback': 'Configure points, coupon or cashback',
  'Segmento, mensaje y recompensa': 'Segment, message and reward',
  'Mensaje para clientes activos': 'Message for active customers',
  'Tarjeta digital con QR': 'Digital card with QR',
  'Ventas, retorno y canjes': 'Sales, return and redemptions',

  Clientes: 'Customers',
  'Módulo de clientes': 'Customer module',
  'Gestiona WhatsApp, email, puntos, niveles, estado y perfiles individuales.':
    'Manage WhatsApp, email, points, tiers, status and individual profiles.',
  'Tabla de clientes': 'Customer table',
  'Datos, puntos, nivel y última visita': 'Data, points, tier and last visit',
  activos: 'active',
  Nombre: 'Name',
  'Teléfono / WhatsApp': 'Phone / WhatsApp',
  'Correo electrónico': 'Email',
  Email: 'Email',
  'Puntos acumulados': 'Accumulated points',
  Nivel: 'Tier',
  'Última visita': 'Last visit',
  Perfil: 'Profile',
  'Cliente desde': 'Customer since',
  'Sin teléfono': 'No phone',
  Activo: 'Active',
  Inactivo: 'Inactive',
  'Ver perfil': 'View profile',
  'Perfil de cliente': 'Customer profile',
  'Volver a clientes': 'Back to customers',
  'Datos, puntos, compras, recompensas, canjes y referidos.':
    'Data, points, purchases, rewards, redemptions and referrals.',
  'Enviar mensaje por WhatsApp': 'Send WhatsApp message',
  Visitas: 'Visits',
  'Gasto total': 'Total spend',
  'Ultima visita': 'Last visit',
  'Puntos disponibles': 'Available points',
  'Progreso a siguiente nivel': 'Progress to next tier',
  'Wallet digital activa': 'Digital wallet active',
  'Listo para Wallet': 'Wallet ready',
  'Historial de compras': 'Purchase history',
  Compra: 'Purchase',
  Monto: 'Amount',
  'Recompensas ganadas': 'Earned rewards',
  'Siguiente mejor acción': 'Next best action',
  'Este cliente tiene alto saldo de puntos y actividad reciente. Recomendación: enviar cupón VIP por WhatsApp con vigencia de 7 días para acelerar un nuevo canje.':
    'This customer has a high point balance and recent activity. Recommendation: send a VIP coupon by WhatsApp valid for 7 days to accelerate a new redemption.',

  Campañas: 'Campaigns',
  'Creador de campaña': 'Campaign builder',
  'Diseña campañas con segmento, WhatsApp, fechas, recompensa y vista previa.':
    'Design campaigns with segment, WhatsApp, dates, reward and preview.',
  'WhatsApp, segmento, fechas y recompensa': 'WhatsApp, segment, dates and reward',
  'Nombre de campaña': 'Campaign name',
  'Tipo de campaña': 'Campaign type',
  'Segmento de clientes': 'Customer segment',
  'Fecha de inicio': 'Start date',
  'Fecha de finalización': 'End date',
  'Recompensa asociada': 'Associated reward',
  'Mensaje de WhatsApp': 'WhatsApp message',
  'Vista previa del mensaje': 'Message preview',
  'Mensaje listo para revisar antes del envío': 'Message ready to review before sending',
  Segmento: 'Segment',
  Vigencia: 'Validity',
  'Envio estimado': 'Estimated send',
  'Guardar campaña': 'Save campaign',
  'Guardando campaña...': 'Saving campaign...',
  'Campaña guardada correctamente.': 'Campaign saved successfully.',
  'No se pudo guardar la campaña. Revisa la conexión y vuelve a intentar.':
    'The campaign could not be saved. Check the connection and try again.',
  'Campañas recientes': 'Recent campaigns',
  'Activas y programadas': 'Active and scheduled',
  Activa: 'Active',
  Programada: 'Scheduled',
  'Sin descripción': 'No description',

  Recompensas: 'Rewards',
  'Módulo de recompensas': 'Rewards module',
  'Administra puntos, cupones, cashback, sellos, cumpleaños, referidos y membresías VIP.':
    'Manage points, coupons, cashback, stamps, birthdays, referrals and VIP memberships.',
  'Reglas por compra, visita, check-in o ticket promedio.': 'Rules by purchase, visit, check-in or average ticket.',
  'Descuentos por segmento, temporada o nivel.': 'Discounts by segment, season or tier.',
  'Crédito digital para compras futuras.': 'Digital credit for future purchases.',
  'Tarjetas tipo compra 9 y recibe la 10 gratis.': 'Buy 9 and get the 10th free card rules.',
  'Beneficios automáticos por fecha especial.': 'Automatic benefits for special dates.',
  'Premios para cliente actual y cliente nuevo.': 'Rewards for current and new customers.',
  'Niveles, cuotas, beneficios y acceso preferente.': 'Tiers, fees, benefits and preferred access.',
  Programado: 'Scheduled',

  'Tarjetas tipo Apple Wallet / Google Wallet para clientes, puntos y QR.':
    'Apple Wallet / Google Wallet style cards for customers, points and QR.',
  'Nombre del negocio': 'Business name',
  'Pase digital descargado.': 'Digital pass downloaded.',
  'Código QR descargado.': 'QR code downloaded.',
  Negocio: 'Business',
  'Código QR': 'QR code',
  Sincronizado: 'Synced',
  'Agregar a Wallet': 'Add to Wallet',
  'Descargar QR': 'Download QR',
  'Balance Total': 'Total balance',
  'puntos disponibles': 'available points',
  'Billeteras Activas': 'Active wallets',
  'Este Mes': 'This month',

  'Página pública': 'Public page',
  'Plantillas para tu página pública': 'Templates for your public page',
  'Elige una base visual para publicar una página con recompensas, wallet digital, referidos y WhatsApp.':
    'Choose a visual base to publish a page with rewards, digital wallet, referrals and WhatsApp.',
  'Landing pública': 'Public landing',
  '6 estilos base': '6 base styles',
  'Programa integrado': 'Integrated program',
  'Puntos, cupones y VIP': 'Points, coupons and VIP',
  'Conversión directa': 'Direct conversion',
  'WhatsApp, QR y Wallet': 'WhatsApp, QR and Wallet',
  'Biblioteca de landpages': 'Landing page library',
  'Plantillas generales para publicar beneficios, recompensas, referidos, wallet digital y servicios del negocio.':
    'General templates to publish benefits, rewards, referrals, digital wallet and business services.',
  Todos: 'All',
  Locales: 'Local',
  Salud: 'Health',
  Elegante: 'Elegant',
  'Vista previa': 'Preview',
  'Usar plantilla': 'Use template',
  'Publicación guiada': 'Guided publishing',
  'Personaliza marca, colores, sucursales y beneficios': 'Customize brand, colors, locations and benefits',
  'Configura el contenido, la identidad visual, los beneficios y las llamadas a la acción antes de publicar.':
    'Configure content, visual identity, benefits and calls to action before publishing.',
  'Solicitar diseño personalizado': 'Request custom design',
  Incluye: 'Includes',
  Cerrar: 'Close',

  'Programa de referidos': 'Referral program',
  'Premia a clientes que invitan nuevos compradores y mide conversiones.':
    'Reward customers who invite new buyers and measure conversions.',
  'Crear enlace de referido': 'Create referral link',
  'Referidos totales': 'Total referrals',
  Conversiones: 'Conversions',
  'Premios entregados': 'Rewards delivered',
  'Actividad de referidos': 'Referral activity',
  'Invitaciones y recompensas': 'Invites and rewards',
  Invitado: 'Invitee',

  Reportes: 'Reports',
  'Reportes ejecutivos': 'Executive reports',
  'Retención, ventas atribuidas, canjes y crecimiento mensual.':
    'Retention, attributed sales, redemptions and monthly growth.',
  'Exportar reporte': 'Export report',
  'Clientes nuevos': 'New customers',
  Crecimiento: 'Growth',
  'Ventas atribuidas por mes': 'Attributed sales by month',
  'Comparativo mensual de ventas vinculadas al programa': 'Monthly comparison of sales linked to the program',

  'Campañas, segmentos, mensajes y resultados en un solo módulo.':
    'Campaigns, segments, messages and results in one module.',
  'Integración conectada': 'Integration connected',
  'Integración pendiente': 'Integration pending',
  'Compositor rápido': 'Quick composer',
  'Mensaje por segmento': 'Message by segment',
  'Clientes inactivos': 'Inactive customers',
  'Clientes VIP': 'VIP customers',
  'Nuevos clientes': 'New customers',
  'Todos los clientes': 'All customers',
  'Enviar campaña': 'Send campaign',
  'Audiencia disponible': 'Available audience',
  'Mensajes enviados': 'Sent messages',
  'Tasa de apertura': 'Open rate',
  'Tasa de entrega': 'Delivery rate',
  'Campañas de WhatsApp': 'WhatsApp campaigns',
  'Rendimiento por mensaje': 'Performance by message',
  'Rendimiento real por campaña': 'Real performance by campaign',
  'Mensajes recientes': 'Recent messages',
  'Últimos intentos registrados': 'Latest recorded attempts',
  'Plantilla aprobada': 'Approved template',
  enviados: 'sent',
  fallidos: 'failed',
  totales: 'total',
  'en cola': 'queued',
  'No hay campañas de WhatsApp enviadas todavía.': 'There are no WhatsApp campaigns sent yet.',
  'Aún no hay mensajes registrados.': 'There are no registered messages yet.',
  'Configura WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID para enviar mensajes reales.':
    'Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to send real messages.',
  'Campaña enviada a la audiencia elegible.': 'Campaign sent to the eligible audience.',
  'No se pudo enviar la campaña.': 'The campaign could not be sent.',
  Enviando: 'Sending',
  'Enviando...': 'Sending...',
  Enviada: 'Sent',
  Fallida: 'Failed',
  'En cola': 'Queued',
  Revisar: 'Review',
  apertura: 'open rate',

  Configuración: 'Settings',
  'Configuración del negocio': 'Business settings',
  'Nombre, logo, colores, sucursales, usuarios, roles e integraciones.':
    'Name, logo, colors, locations, users, roles and integrations.',
  'Datos del negocio': 'Business details',
  'Marca y operación': 'Brand and operations',
  Logo: 'Logo',
  Cambiar: 'Change',
  'Colores de marca': 'Brand colors',
  Primario: 'Primary',
  Acento: 'Accent',
  'Guardar configuración': 'Save settings',
  Sucursales: 'Locations',
  'Ubicaciones conectadas': 'Connected locations',
  'Caja conectada': 'Checkout connected',
  'Wallet activo': 'Wallet active',
  'Usuarios y roles': 'Users and roles',
  'Permisos del equipo': 'Team permissions',
  Propietario: 'Owner',
  Gerente: 'Manager',
  'Equipo operativo': 'Staff',
  Analista: 'Analyst',
  Integraciones: 'Integrations',
  'WhatsApp, sitio web y wallet': 'WhatsApp, website and wallet',
  Cuenta: 'Account',
  Seguridad: 'Security',
  'Branding avanzado': 'Advanced branding',

  'Administrador maestro': 'Master admin',
  'Ir al panel del negocio': 'Go to business panel',
  'Administración SaaS': 'SaaS administration',
  'Cuentas, suscripciones y microservicios': 'Accounts, subscriptions and microservices',
  'Panel del negocio': 'Business panel',
  'Cuentas totales': 'Total accounts',
  'MRR activo': 'Active MRR',
  'Mensual recurrente': 'Monthly recurring',
  'Clientes finales': 'End customers',
  'Entre cuentas SaaS': 'Across SaaS accounts',
  'Módulos activos': 'Active modules',
  'Microservicios habilitados': 'Enabled microservices',
  'Planes con alerta': 'Plans with alert',
  'Pago pendiente': 'Payment pending',
  'Cuentas de clientes SaaS': 'SaaS customer accounts',
  'Negocios, dueños, planes, usuarios y estado de suscripción.':
    'Businesses, owners, plans, users and subscription status.',
  'Buscar cuenta...': 'Search account...',
  Plan: 'Plan',
  Usuarios: 'Users',
  Administrar: 'Manage',
  'Cuenta seleccionada': 'Selected account',
  Inicial: 'Starter',
  Escala: 'Scale',
  Empresarial: 'Enterprise',
  Personalizado: 'Custom',
  Prueba: 'Trial',
  Pausada: 'Paused',
  Microservicios: 'Microservices',
  'Control por cuenta': 'Account-level control',
  'Cada opción del panel del negocio funciona como un módulo activable por cliente. El panel principal permanece activo para conservar el acceso operativo de la cuenta.':
    'Each option in the business panel works as a module that can be enabled per customer. The main dashboard remains active to preserve account access.',
  Principal: 'Core',
  Operación: 'Operations',
  'Planes y suscripciones': 'Plans and subscriptions',
  'Control comercial': 'Commercial control',
  'Administra límites, módulos incluidos, cambios de plan y estado de suscripción desde un solo lugar.':
    'Manage limits, included modules, plan changes and subscription status from one place.',
  Actual: 'Current',
  'Acciones de suscripción': 'Subscription actions',
  'Cambiar plan, pausar cuenta, extender prueba o bloquear módulos por falta de pago.':
    'Change plan, pause account, extend trial or block modules for non-payment.',
  'Extender prueba': 'Extend trial',
  'Pausar cuenta': 'Pause account',
  'Actualizar plan': 'Update plan',
  'Acceso administrador': 'Admin access',
  'Inicia sesión con una cuenta autorizada para administrar clientes SaaS, planes y microservicios.':
    'Sign in with an authorized account to manage SaaS customers, plans and microservices.',
  'Acceso maestro restringido': 'Master access restricted',
  'La cuenta': 'The account',
  'inició sesión correctamente, pero no está autorizada para administrar cuentas SaaS,': 'signed in successfully, but is not authorized to manage SaaS accounts,',
  'suscripciones ni microservicios.': 'subscriptions or microservices.',
  'Volver al panel del negocio': 'Back to business panel',
  'Cerrar sesión e intentar otra cuenta': 'Sign out and try another account',

  'Registra tu negocio': 'Register your business',
  'Bienvenido de vuelta': 'Welcome back',
  'Crea tu programa de fidelización': 'Create your loyalty program',
  'Inicia sesión en tu cuenta': 'Sign in to your account',
  'Tu nombre': 'Your name',
  Contraseña: 'Password',
  'Por favor espera...': 'Please wait...',
  'Crear mi programa': 'Create my program',
  'Iniciar sesión': 'Sign in',
  'Al registrarte aceptas nuestros términos de servicio y política de privacidad.':
    'By registering, you accept our terms of service and privacy policy.',
  '¿Ya tienes cuenta?': 'Already have an account?',
  '¿No tienes cuenta?': 'Do not have an account?',
  'Mi Restaurante, Spa Wellness, etc.': 'My Restaurant, Wellness Spa, etc.',
  'Tu nombre completo': 'Your full name',
  'correo@negocio.com': 'email@business.com',
  'Sin cuentas registradas': 'No registered accounts',
  'Las cuentas aparecerán cuando existan usuarios registrados en producción.':
    'Accounts will appear when registered users exist in production.',
  'Sin cuentas en riesgo': 'No at-risk accounts',
  'No hay pagos pendientes ni cuentas sin actividad crítica.':
    'There are no pending payments or accounts with critical inactivity.',
  'No hay tickets abiertos.': 'There are no open tickets.',
  'Sin feedback registrado': 'No feedback recorded',
  'El feedback real aparecerá aquí cuando se capture desde soporte o éxito del cliente.':
    'Real feedback will appear here when captured by support or customer success.',
  'Activación rápida': 'Quick activation',
  'Alta guiada de un negocio': 'Guided business setup',
  'Activar negocio': 'Activate business',
  'Valor en minutos': 'Value in minutes',
  'Explicación para clientes nuevos': 'Explanation for new customers',
  'Riesgo y cobranza': 'Risk and collections',
  'Clientes que necesitan atención': 'Customers that need attention',
  'Tickets de clientes': 'Customer tickets',
  'Preguntas, feedback y soporte': 'Questions, feedback and support',
  'Feedback real': 'Real feedback',
  'Aprendizajes para iterar': 'Learnings to iterate',
  'Cambios persistidos': 'Persisted changes',
  'Guardando...': 'Saving...',
  'Sin clientes registrados': 'No registered customers',
  'Agrega el primer cliente para empezar a acumular puntos, visitas y recompensas reales.':
    'Add the first customer to start accumulating real points, visits and rewards.',
  'Sin transacciones': 'No transactions',
  'Los puntos emitidos y canjeados aparecerán cuando existan movimientos reales.':
    'Issued and redeemed points will appear when real movements exist.',
  'Sin campañas creadas': 'No campaigns created',
  'Crea una campaña para medir audiencia, fechas, multiplicador y rendimiento real.':
    'Create a campaign to measure real audience, dates, multiplier and performance.',
  'Sin recompensas creadas': 'No rewards created',
  'Crea la primera recompensa para empezar a emitir puntos, cupones o beneficios reales.':
    'Create the first reward to start issuing real points, coupons or benefits.',
  'Sin actividad reciente': 'No recent activity',
  'La actividad aparecerá cuando registres clientes, transacciones o canjes reales.':
    'Activity will appear when you register real customers, transactions or redemptions.',
  'Sin crecimiento registrado': 'No growth recorded',
  'El gráfico se llenará con clientes y ventas reales.':
    'The chart will populate with real customers and sales.',
  'Sin compras registradas.': 'No purchases recorded.',
  'Sin recompensas ganadas.': 'No earned rewards.',
  'Sin recompensas canjeadas.': 'No redeemed rewards.',
  'Sin referidos registrados.': 'No referrals recorded.',
  'Usa los datos reales de puntos, actividad y compras para definir la siguiente acción comercial.':
    'Use real points, activity and purchase data to define the next commercial action.',
  'Sin referidos registrados todavía.': 'No referrals recorded yet.',
  'No configurado': 'Not configured',
  'Configuración guardada.': 'Settings saved.',
  'Sin sucursales adicionales': 'No additional locations',
  'La sucursal principal se crea con la cuenta del negocio.':
    'The main location is created with the business account.',
  'Sin cuenta para previsualizar': 'No account to preview',
  'La vista muestra se habilitará cuando exista al menos una cuenta real.':
    'The preview will be enabled when at least one real account exists.',
  'Sin campaña activa': 'No active campaign',
  'Las campañas activas aparecerán aquí cuando el negocio las cree.':
    'Active campaigns will appear here when the business creates them.',
  'Tarjeta digital de muestra': 'Sample digital card',
  'Sin wallet de cliente seleccionada.': 'No customer wallet selected.',
  'Sin registro': 'No record',
  'Sin datos': 'No data',
  'Sin configurar': 'Not configured',
  'Operación POS': 'POS operations',
  'Empleado del negocio': 'Business employee',
  'Herramientas rápidas para recepción, caja, barberos, meseros y asistentes: registrar clientes, escanear QR, aplicar recompensas, verificar puntos y encontrar perfiles.':
    'Fast tools for reception, checkout, barbers, waiters and assistants: register customers, scan QR codes, apply rewards, verify points and find profiles.',
  'Registro, búsqueda, emisión de puntos y canje de recompensas usando clientes y recompensas reales del negocio.':
    'Registration, search, point issuing and reward redemption using real business customers and rewards.',
  'Usar ID/QR': 'Use ID/QR',
  'Clientes registrados': 'Registered customers',
  'Puntos en wallets': 'Wallet points',
  'Saldo acumulado': 'Accumulated balance',
  'Recompensas activas': 'Active rewards',
  'Cliente seleccionado': 'Selected customer',
  'Registro rápido': 'Quick registration',
  'Nuevo cliente': 'New customer',
  'Nombre del cliente': 'Customer name',
  Teléfono: 'Phone',
  'Guardar cliente': 'Save customer',
  'No hay clientes que coincidan.': 'No matching customers.',
  'Wallet del cliente': 'Customer wallet',
  'Selecciona un cliente': 'Select a customer',
  'Busca o registra un cliente para operar.': 'Search or register a customer to operate.',
  'Detener cámara': 'Stop camera',
  'Lector QR de cámara': 'Camera QR reader',
  'QR leído correctamente.': 'QR read successfully.',
  'Este navegador no soporta escaneo QR por cámara. Usa la búsqueda manual.':
    'This browser does not support camera QR scanning. Use manual search.',
  'No se pudo iniciar la cámara.': 'The camera could not be started.',
  'Emitir puntos': 'Issue points',
  Motivo: 'Reason',
  'Compra, visita, ajuste...': 'Purchase, visit, adjustment...',
  'Canjear recompensa': 'Redeem reward',
  'Selecciona recompensa': 'Select reward',
  'No hay recompensas activas configuradas.': 'There are no active rewards configured.',
  Canjear: 'Redeem',
  'Acciones por empleado': 'Employee actions',
  'Alta rápida con nombre, email y teléfono.': 'Quick signup with name, email and phone.',
  'Pega o lee el código y localiza el wallet del cliente.': 'Paste or scan the code and locate the customer wallet.',
  'Valida puntos disponibles y registra el canje.': 'Validate available points and register the redemption.',
  'Consulta saldo antes de cobrar o cerrar visita.': 'Check balance before checkout or closing the visit.',
  'Busca por nombre, teléfono, email o ID.': 'Search by name, phone, email or ID.',
  'Cliente registrado.': 'Customer registered.',
  'Puntos emitidos.': 'Points issued.',
  'Recompensa canjeada.': 'Reward redeemed.',
  'No se pudo registrar el cliente.': 'The customer could not be registered.',
  'No se pudieron emitir los puntos.': 'Points could not be issued.',
  'No se pudo canjear la recompensa.': 'The reward could not be redeemed.',
  'Selecciona un cliente.': 'Select a customer.',
  'Selecciona una recompensa.': 'Select a reward.',
  'Los puntos deben ser mayores a cero.': 'Points must be greater than zero.',
  'Cliente no encontrado.': 'Customer not found.',
  'Recompensa no disponible.': 'Reward not available.',
  'El cliente no tiene puntos suficientes.': 'The customer does not have enough points.',
  'Clientes hoy': 'Customers today',
  'QR escaneados': 'Scanned QR codes',
  'Canjes aplicados': 'Applied redemptions',
  'Puntos emitidos': 'Issued points',
  Búsquedas: 'Searches',
  'Búsqueda rápida': 'Quick search',
  'Encontrar cliente': 'Find customer',
  'Busca un cliente real para ver puntos, estado y acciones disponibles.':
    'Search for a real customer to see points, status and available actions.',
  'Flujo de operación': 'Operations workflow',
  'Acciones esperadas por empleado': 'Expected employee actions',
  'Cuentas SaaS': 'SaaS accounts',
  'Crea el primer negocio desde el administrador.': 'Create the first business from the admin console.',
  'Crear negocio': 'Create business',
  'Negocios registrados': 'Registered businesses',
  'Negocios reales, dueños, plan, MRR y estado operativo.': 'Real businesses, owners, plan, MRR and operating status.',
  'No hay cuentas que coincidan con la búsqueda.': 'No accounts match the search.',
  'Editar cuenta': 'Edit account',
  Eliminar: 'Delete',
  'Riesgo de cuenta': 'Account risk',
  'Última actividad:': 'Last activity:',
  'Módulos y microservicios en uso': 'Modules and microservices in use',
  'Editar negocio': 'Edit business',
  Dueño: 'Owner',
  'Email del dueño': 'Owner email',
  Sano: 'Healthy',
  'En observación': 'Under observation',
  'En riesgo': 'At risk',
  Trial: 'Trial',
  Cancelar: 'Cancel',
  'Guardar negocio': 'Save business',
  'No se pudo guardar el negocio.': 'The business could not be saved.',
  'No se pudo eliminar el negocio.': 'The business could not be deleted.',
  'Invalid business account': 'Invalid business account',
  'Portal cliente': 'Customer portal',
  'Portal cliente y wallet': 'Customer portal and wallet',
  'Cliente final': 'End customer',
  'Experiencia para los clientes de barberías, restaurantes, gimnasios, cafeterías y otros negocios afiliados: escanear QR, registrarse, consultar wallet, recibir recompensas y compartir referidos.':
    'Experience for customers of barbershops, restaurants, gyms, coffee shops and other affiliated businesses: scan QR, sign up, check wallet, receive rewards and share referrals.',
  'Generar QR público': 'Generate public QR',
  'Vista móvil': 'Mobile view',
  'Vista del cliente': 'Customer view',
  'Sin wallet emitida': 'No wallet issued',
  Pendiente: 'Pending',
  'Opt-in pendiente': 'Opt-in pending',
  'Wallet pendiente': 'Wallet pending',
  'Journey del cliente': 'Customer journey',
  'Qué puede hacer desde el QR': 'What they can do from the QR',
  'Escanear QR': 'Scan QR',
  Registrarse: 'Sign up',
  'Usar wallet': 'Use wallet',
  'Canjear recompensas': 'Redeem rewards',
  'Invitar amigos': 'Invite friends',
  'El cliente entra desde mostrador, mesa, recepción o link.':
    'The customer enters from the counter, table, reception or link.',
  'Crea perfil con teléfono y acepta recibir recompensas.':
    'Creates a profile with phone number and agrees to receive rewards.',
  'Consulta puntos, nivel, QR personal y beneficios disponibles.':
    'Checks points, tier, personal QR and available benefits.',
  'Muestra QR o código para aplicar puntos, cupón o cashback.':
    'Shows QR or code to apply points, coupon or cashback.',
  'Comparte link y gana puntos cuando el referido compra.':
    'Shares a link and earns points when the referral buys.',
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'es'

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored

  const cookieLocale = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${LOCALE_COOKIE_KEY}=`))
    ?.split('=')[1]

  return cookieLocale === 'en' ? 'en' : 'es'
}

function setLocale(locale: Locale) {
  document.documentElement.lang = locale
  document.documentElement.dataset.locale = locale
}

function translateText(value: string, locale: Locale) {
  const trimmed = value.trim()
  if (!trimmed) return value

  const translated = dictionary[trimmed]
  if (!translated && locale === 'en' && process.env.NODE_ENV === 'development' && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(trimmed)) {
    missingTranslations.add(trimmed)
    if (missingTranslations.size <= 25) {
      console.warn(`[i18n] Missing translation: "${trimmed}"`)
    }
  }
  if (!translated) return value

  return value.replace(trimmed, locale === 'en' ? translated : trimmed)
}

function applyTranslations(root: ParentNode, locale: Locale) {
  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes: Text[] = []
  while (textWalker.nextNode()) {
    nodes.push(textWalker.currentNode as Text)
  }

  nodes.forEach((node) => {
    const original = originalTextNodes.get(node) ?? node.nodeValue ?? ''
    originalTextNodes.set(node, original)
    node.nodeValue = translateText(original, locale)
  })

  document.querySelectorAll<HTMLElement>('[placeholder]').forEach((element) => {
    const original = element.dataset.i18nOriginalPlaceholder ?? element.getAttribute('placeholder') ?? ''
    element.dataset.i18nOriginalPlaceholder = original
    element.setAttribute('placeholder', translateText(original, locale))
  })

  document.querySelectorAll<HTMLElement>('[aria-label]').forEach((element) => {
    const original = element.dataset.i18nOriginalAriaLabel ?? element.getAttribute('aria-label') ?? ''
    element.dataset.i18nOriginalAriaLabel = original
    element.setAttribute('aria-label', translateText(original, locale))
  })
}

export function LanguageRuntime() {
  useEffect(() => {
    const update = () => {
      const locale = getStoredLocale()
      setLocale(locale)
      applyTranslations(document.body, locale)
    }

    update()

    const observer = new MutationObserver(() => update())
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('ingresax:locale-change', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('ingresax:locale-change', update)
    }
  }, [])

  return null
}

export { LOCALE_COOKIE_KEY, LOCALE_STORAGE_KEY }
export type { Locale }
