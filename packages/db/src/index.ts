import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sellers = pgTable("sellers", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  sellerType: text("seller_type").notNull(),
  publicSlug: text("public_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquirySettings = pgTable("inquiry_settings", {
  sellerId: text("seller_id").primaryKey(),
  categoriesJson: jsonb("categories_json").notNull(),
  notificationMode: text("notification_mode").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  publicSlug: text("public_slug").notNull(),
  categoryCode: text("category_code").notNull(),
  actionLabel: text("action_label").notNull(),
  rawMessage: text("raw_message").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
