CREATE TABLE "whatsapp_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"campaignId" text,
	"clientId" text,
	"recipient" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"providerMessageId" text,
	"error" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
