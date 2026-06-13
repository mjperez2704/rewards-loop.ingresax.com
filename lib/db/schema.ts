import { pgTable, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  status: text('status').notNull().default('active'),
  loyaltyTier: text('loyaltyTier').notNull().default('Gold'),
  totalPoints: integer('totalPoints').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const rewards = pgTable('rewards', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  pointsRequired: integer('pointsRequired').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate').notNull(),
  pointsMultiplier: real('pointsMultiplier').notNull().default(1.0),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: text('clientId'),
  balance: integer('balance').notNull().default(0),
  currency: text('currency').notNull().default('points'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  walletId: text('walletId'),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const adminConsoleUsers = pgTable('admin_console_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(),
  status: text('status').notNull().default('Invitado'),
  permissions: text('permissions').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const businessAccounts = pgTable('business_accounts', {
  id: text('id').primaryKey(),
  ownerUserId: text('ownerUserId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  businessName: text('businessName').notNull(),
  ownerName: text('ownerName').notNull(),
  ownerEmail: text('ownerEmail').notNull(),
  plan: text('plan').notNull().default('Starter'),
  status: text('status').notNull().default('active'),
  mrr: integer('mrr').notNull().default(0),
  locations: integer('locations').notNull().default(1),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const businessModuleEntitlements = pgTable('business_module_entitlements', {
  id: text('id').primaryKey(),
  accountId: text('accountId')
    .notNull()
    .references(() => businessAccounts.id, { onDelete: 'cascade' }),
  moduleKey: text('moduleKey').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const supportTickets = pgTable('support_tickets', {
  id: text('id').primaryKey(),
  accountId: text('accountId').references(() => businessAccounts.id, { onDelete: 'set null' }),
  type: text('type').notNull().default('Soporte'),
  subject: text('subject').notNull(),
  priority: text('priority').notNull().default('Media'),
  status: text('status').notNull().default('Abierto'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const feedbackItems = pgTable('feedback_items', {
  id: text('id').primaryKey(),
  accountId: text('accountId').references(() => businessAccounts.id, { onDelete: 'set null' }),
  quote: text('quote').notNull(),
  tag: text('tag').notNull().default('General'),
  status: text('status').notNull().default('Recibido'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const servicePlans = pgTable('service_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  priceMonthly: integer('priceMonthly').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  description: text('description'),
  includedModules: text('includedModules').notNull().default(''),
  customerLimit: integer('customerLimit').notNull().default(1000),
  campaignLimit: integer('campaignLimit').notNull().default(5),
  whatsappLimit: integer('whatsappLimit').notNull().default(5000),
  userLimit: integer('userLimit').notNull().default(3),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const adminRoles = pgTable('admin_roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  permissions: text('permissions').notNull(),
  locked: boolean('locked').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const whatsappEvents = pgTable('whatsapp_events', {
  id: text('id').primaryKey(),
  eventType: text('eventType').notNull(),
  sender: text('sender'),
  payload: text('payload').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const whatsappMessages = pgTable('whatsapp_messages', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  campaignId: text('campaignId'),
  clientId: text('clientId'),
  recipient: text('recipient').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('queued'),
  providerMessageId: text('providerMessageId'),
  error: text('error'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
