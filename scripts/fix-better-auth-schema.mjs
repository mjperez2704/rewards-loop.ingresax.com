import fs from 'node:fs'
import { Pool } from 'pg'

function loadEnv() {
  const envPath = new URL('../.env', import.meta.url)
  const env = {}

  if (!fs.existsSync(envPath)) return env

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator)
    const value = trimmed.slice(separator + 1).replace(/^["']|["']$/g, '')
    env[key] = value
  }

  return env
}

const env = { ...loadEnv(), ...process.env }

if (!env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Add it to .env before running this script.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

const createTables = [
  `CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text,
    "email" text NOT NULL,
    "emailVerified" boolean NOT NULL DEFAULT false,
    "image" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "expiresAt" timestamp NOT NULL,
    "token" text NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "accessTokenExpiresAt" timestamp,
    "refreshTokenExpiresAt" timestamp,
    "scope" text,
    "password" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamp NOT NULL,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "clients" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text,
    "status" text NOT NULL DEFAULT 'active',
    "loyaltyTier" text NOT NULL DEFAULT 'Gold',
    "totalPoints" integer NOT NULL DEFAULT 0,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "rewards" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "pointsRequired" integer NOT NULL,
    "category" text NOT NULL,
    "status" text NOT NULL DEFAULT 'active',
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "campaigns" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "startDate" timestamp NOT NULL,
    "endDate" timestamp NOT NULL,
    "pointsMultiplier" real NOT NULL DEFAULT 1,
    "status" text NOT NULL DEFAULT 'active',
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "wallets" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "clientId" text,
    "balance" integer NOT NULL DEFAULT 0,
    "currency" text NOT NULL DEFAULT 'points',
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "transactions" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "walletId" text,
    "amount" integer NOT NULL,
    "type" text NOT NULL,
    "description" text,
    "createdAt" timestamp NOT NULL DEFAULT now()
  )`,
]

const statements = [
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerified" boolean NOT NULL DEFAULT false`,
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "image" text`,
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "expiresAt" timestamp`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "token" text`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "ipAddress" text`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "userAgent" text`,
  `ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "userId" text`,

  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "accountId" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "providerId" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "accessToken" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "refreshToken" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" timestamp`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" timestamp`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "scope" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "password" text`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "identifier" text`,
  `ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "value" text`,
  `ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "expiresAt" timestamp`,
  `ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now()`,
  `ALTER TABLE "verification" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now()`,

  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "name" text`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "email" text`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "phone" text`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active'`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "loyaltyTier" text DEFAULT 'Gold'`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "totalPoints" integer DEFAULT 0`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "title" text`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "description" text`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "pointsRequired" integer`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "category" text`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active'`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "rewards" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "name" text`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "description" text`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "startDate" timestamp`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "endDate" timestamp`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "pointsMultiplier" real DEFAULT 1`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active'`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "clientId" text`,
  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "balance" integer DEFAULT 0`,
  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'points'`,
  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
  `ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,

  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "userId" text`,
  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "walletId" text`,
  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "amount" integer`,
  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "type" text`,
  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "description" text`,
  `ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`,
]

const indexes = [
  `CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique_idx" ON "user" ("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "session_token_unique_idx" ON "session" ("token") WHERE "token" IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS "clients_user_id_idx" ON "clients" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "rewards_user_id_idx" ON "rewards" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "campaigns_user_id_idx" ON "campaigns" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "wallets_user_id_idx" ON "wallets" ("userId")`,
  `CREATE INDEX IF NOT EXISTS "transactions_user_id_idx" ON "transactions" ("userId")`,
]

const relaxLegacyLowercaseColumns = [
  `ALTER TABLE "user" ALTER COLUMN "emailverified" DROP NOT NULL`,
  `ALTER TABLE "account" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "account" ALTER COLUMN "accountid" DROP NOT NULL`,
  `ALTER TABLE "account" ALTER COLUMN "providerid" DROP NOT NULL`,
  `ALTER TABLE "session" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "session" ALTER COLUMN "expiresat" DROP NOT NULL`,
  `ALTER TABLE "verification" ALTER COLUMN "expiresat" DROP NOT NULL`,
  `ALTER TABLE "clients" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "clients" ALTER COLUMN "loyaltytier" DROP NOT NULL`,
  `ALTER TABLE "clients" ALTER COLUMN "totalpoints" DROP NOT NULL`,
  `ALTER TABLE "clients" ALTER COLUMN "createdat" DROP NOT NULL`,
  `ALTER TABLE "clients" ALTER COLUMN "updatedat" DROP NOT NULL`,
  `ALTER TABLE "rewards" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "rewards" ALTER COLUMN "pointsrequired" DROP NOT NULL`,
  `ALTER TABLE "rewards" ALTER COLUMN "createdat" DROP NOT NULL`,
  `ALTER TABLE "rewards" ALTER COLUMN "updatedat" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "startdate" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "enddate" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "pointsmultiplier" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "createdat" DROP NOT NULL`,
  `ALTER TABLE "campaigns" ALTER COLUMN "updatedat" DROP NOT NULL`,
  `ALTER TABLE "wallets" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "wallets" ALTER COLUMN "clientid" DROP NOT NULL`,
  `ALTER TABLE "wallets" ALTER COLUMN "createdat" DROP NOT NULL`,
  `ALTER TABLE "wallets" ALTER COLUMN "updatedat" DROP NOT NULL`,
  `ALTER TABLE "transactions" ALTER COLUMN "userid" DROP NOT NULL`,
  `ALTER TABLE "transactions" ALTER COLUMN "walletid" DROP NOT NULL`,
  `ALTER TABLE "transactions" ALTER COLUMN "createdat" DROP NOT NULL`,
]

const copyLegacyCamelCaseColumns = [
  `UPDATE "account" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "account" SET "accountId" = "accountid" WHERE "accountId" IS NULL AND "accountid" IS NOT NULL`,
  `UPDATE "account" SET "providerId" = "providerid" WHERE "providerId" IS NULL AND "providerid" IS NOT NULL`,
  `UPDATE "account" SET "accessToken" = "accesstoken" WHERE "accessToken" IS NULL AND "accesstoken" IS NOT NULL`,
  `UPDATE "account" SET "refreshToken" = "refreshtoken" WHERE "refreshToken" IS NULL AND "refreshtoken" IS NOT NULL`,
  `UPDATE "account" SET "accessTokenExpiresAt" = "accesstokenexpiresat" WHERE "accessTokenExpiresAt" IS NULL AND "accesstokenexpiresat" IS NOT NULL`,
  `UPDATE "account" SET "refreshTokenExpiresAt" = "refreshtokenexpiresat" WHERE "refreshTokenExpiresAt" IS NULL AND "refreshtokenexpiresat" IS NOT NULL`,
  `UPDATE "session" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "session" SET "expiresAt" = "expiresat" WHERE "expiresAt" IS NULL AND "expiresat" IS NOT NULL`,
  `UPDATE "verification" SET "expiresAt" = "expiresat" WHERE "expiresAt" IS NULL AND "expiresat" IS NOT NULL`,
  `UPDATE "clients" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "clients" SET "loyaltyTier" = "loyaltytier" WHERE "loyaltyTier" IS NULL AND "loyaltytier" IS NOT NULL`,
  `UPDATE "clients" SET "totalPoints" = "totalpoints" WHERE "totalPoints" IS NULL AND "totalpoints" IS NOT NULL`,
  `UPDATE "clients" SET "createdAt" = "createdat" WHERE "createdAt" IS NULL AND "createdat" IS NOT NULL`,
  `UPDATE "clients" SET "updatedAt" = "updatedat" WHERE "updatedAt" IS NULL AND "updatedat" IS NOT NULL`,
  `UPDATE "rewards" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "rewards" SET "pointsRequired" = "pointsrequired" WHERE "pointsRequired" IS NULL AND "pointsrequired" IS NOT NULL`,
  `UPDATE "rewards" SET "createdAt" = "createdat" WHERE "createdAt" IS NULL AND "createdat" IS NOT NULL`,
  `UPDATE "rewards" SET "updatedAt" = "updatedat" WHERE "updatedAt" IS NULL AND "updatedat" IS NOT NULL`,
  `UPDATE "campaigns" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "campaigns" SET "startDate" = "startdate" WHERE "startDate" IS NULL AND "startdate" IS NOT NULL`,
  `UPDATE "campaigns" SET "endDate" = "enddate" WHERE "endDate" IS NULL AND "enddate" IS NOT NULL`,
  `UPDATE "campaigns" SET "pointsMultiplier" = "pointsmultiplier" WHERE "pointsMultiplier" IS NULL AND "pointsmultiplier" IS NOT NULL`,
  `UPDATE "campaigns" SET "createdAt" = "createdat" WHERE "createdAt" IS NULL AND "createdat" IS NOT NULL`,
  `UPDATE "campaigns" SET "updatedAt" = "updatedat" WHERE "updatedAt" IS NULL AND "updatedat" IS NOT NULL`,
  `UPDATE "wallets" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "wallets" SET "clientId" = "clientid" WHERE "clientId" IS NULL AND "clientid" IS NOT NULL`,
  `UPDATE "wallets" SET "createdAt" = "createdat" WHERE "createdAt" IS NULL AND "createdat" IS NOT NULL`,
  `UPDATE "wallets" SET "updatedAt" = "updatedat" WHERE "updatedAt" IS NULL AND "updatedat" IS NOT NULL`,
  `UPDATE "transactions" SET "userId" = "userid" WHERE "userId" IS NULL AND "userid" IS NOT NULL`,
  `UPDATE "transactions" SET "walletId" = "walletid" WHERE "walletId" IS NULL AND "walletid" IS NOT NULL`,
  `UPDATE "transactions" SET "createdAt" = "createdat" WHERE "createdAt" IS NULL AND "createdat" IS NOT NULL`,
]

async function runIfColumnExists(statement, tableName, columnName) {
  const { rowCount } = await pool.query(
    `
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = $1
        and column_name = $2
    `,
    [tableName, columnName],
  )

  if (rowCount > 0) {
    await pool.query(statement)
  }
}

async function runIfColumnsExist(statement) {
  const match = statement.match(/UPDATE "([^"]+)".*SET "([^"]+)".*= "([^"]+)"/)
  if (!match) return

  const [, tableName, targetColumn, sourceColumn] = match
  const { rowCount } = await pool.query(
    `
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = $1
        and column_name in ($2, $3)
      group by table_name
      having count(*) = 2
    `,
    [tableName, targetColumn, sourceColumn],
  )

  if (rowCount > 0) {
    await pool.query(statement)
  }
}

try {
  for (const statement of createTables) {
    await pool.query(statement)
  }

  for (const statement of statements) {
    await pool.query(statement)
  }

  for (const statement of indexes) {
    await pool.query(statement)
  }

  for (const statement of relaxLegacyLowercaseColumns) {
    const match = statement.match(/ALTER TABLE "([^"]+)" ALTER COLUMN "([^"]+)"/)
    if (match) {
      await runIfColumnExists(statement, match[1], match[2])
    }
  }

  for (const statement of copyLegacyCamelCaseColumns) {
    await runIfColumnsExist(statement)
  }

  const { rows } = await pool.query(`
    select table_name, column_name, data_type, is_nullable
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('user', 'session', 'account', 'verification')
      or table_schema = 'public'
      and table_name in ('clients', 'rewards', 'campaigns', 'wallets', 'transactions')
    order by table_name, ordinal_position
  `)

  console.log(JSON.stringify(rows, null, 2))
} finally {
  await pool.end()
}
