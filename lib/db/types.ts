import type { InferSelectModel } from 'drizzle-orm'
import {
  account,
  adminConsoleUsers,
  adminRoles,
  businessAccounts,
  businessModuleEntitlements,
  campaigns,
  clients,
  feedbackItems,
  rewards,
  servicePlans,
  session,
  supportTickets,
  transactions,
  user,
  verification,
  whatsappEvents,
  whatsappMessages,
  wallets,
} from '@/lib/db/schema'

export type UserRecord = InferSelectModel<typeof user>
export type SessionRecord = InferSelectModel<typeof session>
export type AccountRecord = InferSelectModel<typeof account>
export type VerificationRecord = InferSelectModel<typeof verification>
export type ClientRecord = InferSelectModel<typeof clients>
export type RewardRecord = InferSelectModel<typeof rewards>
export type CampaignRecord = InferSelectModel<typeof campaigns>
export type WalletRecord = InferSelectModel<typeof wallets>
export type TransactionRecord = InferSelectModel<typeof transactions>
export type AdminConsoleUserRecord = InferSelectModel<typeof adminConsoleUsers>
export type AdminRoleRecord = InferSelectModel<typeof adminRoles>
export type BusinessAccountRecord = InferSelectModel<typeof businessAccounts>
export type BusinessModuleEntitlementRecord = InferSelectModel<typeof businessModuleEntitlements>
export type SupportTicketRecord = InferSelectModel<typeof supportTickets>
export type FeedbackItemRecord = InferSelectModel<typeof feedbackItems>
export type ServicePlanRecord = InferSelectModel<typeof servicePlans>
export type WhatsappEventRecord = InferSelectModel<typeof whatsappEvents>
export type WhatsappMessageRecord = InferSelectModel<typeof whatsappMessages>
