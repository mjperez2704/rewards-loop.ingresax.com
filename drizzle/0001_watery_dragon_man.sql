CREATE TABLE "whatsapp_events" (
	"id" text PRIMARY KEY NOT NULL,
	"eventType" text NOT NULL,
	"sender" text,
	"payload" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
