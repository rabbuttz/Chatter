import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const sellers = pgTable("sellers", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  sellerType: text("seller_type").notNull(),
  publicSlug: text("public_slug").notNull(),
  publicStatus: text("public_status").notNull(),
  setupCompleted: boolean("setup_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sellerSettings = pgTable("seller_settings", {
  sellerId: text("seller_id").primaryKey(),
  shopName: text("shop_name").notNull(),
  autoReplyTone: text("auto_reply_tone").notNull(),
  scopeMessage: text("scope_message").notNull(),
  publicIntroMessage: text("public_intro_message").notNull(),
  starterButtonsJson: jsonb("starter_buttons_json").$type<string[]>().notNull(),
  notificationEmail: text("notification_email"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sellerPolicies = pgTable(
  "seller_policies",
  {
    sellerId: text("seller_id").notNull(),
    categoryCode: text("category_code").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    handlingMode: text("handling_mode").notNull(),
    notificationMode: text("notification_mode").notNull(),
    starterButtonLabel: text("starter_button_label"),
    displayOrder: integer("display_order").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.sellerId, table.categoryCode] })],
);

export const knowledgeSources = pgTable("knowledge_sources", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  sourceType: text("source_type").notNull(),
  status: text("status").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  tagsJson: jsonb("tags_json").$type<string[]>().notNull(),
  sellerTypesJson: jsonb("seller_types_json").$type<string[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  publicSlug: text("public_slug").notNull(),
  status: text("status").notNull(),
  categoryCode: text("category_code").notNull(),
  handlingMode: text("handling_mode").notNull(),
  notificationMode: text("notification_mode").notNull(),
  rawMessage: text("raw_message").notNull(),
  responsePreview: text("response_preview"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notificationSummaries = pgTable("notification_summaries", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  inquiryId: text("inquiry_id").notNull(),
  categoryCode: text("category_code").notNull(),
  urgency: text("urgency").notNull(),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  suggestedAction: text("suggested_action").notNull(),
  userMessagePreview: text("user_message_preview").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
