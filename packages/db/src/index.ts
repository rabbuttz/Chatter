import type { PublicStatus, SellerType } from "@ichijiuke/domain";
import postgres from "postgres";

export type SellerAccount = {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  sellerType: SellerType;
  publicSlug: string;
  publicStatus: PublicStatus;
  setupCompleted: boolean;
  notificationEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SellerWorkspaceRecord = {
  sellerId: string;
  workspaceJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateSellerAccountInput = {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  sellerType: SellerType;
  publicSlug: string;
  publicStatus?: PublicStatus;
  setupCompleted?: boolean;
  notificationEmail?: string | null;
};

export type SaveSellerProfileInput = {
  id: string;
  displayName: string;
  email: string;
  sellerType: SellerType;
  publicSlug: string;
  publicStatus?: PublicStatus;
  setupCompleted?: boolean;
  notificationEmail?: string | null;
};

type SellerRow = {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  sellerType: SellerType;
  publicSlug: string;
  publicStatus: PublicStatus;
  setupCompleted: boolean;
  notificationEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type WorkspaceRow = {
  sellerId: string;
  workspaceJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const RESERVED_PUBLIC_SLUGS = new Set([
  "api",
  "c",
  "dashboard",
  "demo-shop",
  "inbox",
  "login",
  "settings",
  "setup",
  "signup",
]);

let client: postgres.Sql | null = null;
let schemaPromise: Promise<void> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

function getClient() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!client) {
    client = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
    });
  }

  return client;
}

function mapSeller(row: SellerRow): SellerAccount {
  return {
    id: row.id,
    displayName: row.displayName,
    email: row.email,
    passwordHash: row.passwordHash,
    sellerType: row.sellerType,
    publicSlug: row.publicSlug,
    publicStatus: row.publicStatus,
    setupCompleted: row.setupCompleted,
    notificationEmail: row.notificationEmail,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapWorkspace(row: WorkspaceRow): SellerWorkspaceRecord {
  return {
    sellerId: row.sellerId,
    workspaceJson: row.workspaceJson,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function isDatabaseConfigured() {
  return getDatabaseUrl().length > 0;
}

export function isReservedPublicSlug(publicSlug: string) {
  return RESERVED_PUBLIC_SLUGS.has(publicSlug.trim().toLowerCase());
}

export async function ensureDatabaseSchema() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!schemaPromise) {
    schemaPromise = (async () => {
      const sql = getClient();

      await sql`
        create table if not exists sellers (
          id text primary key,
          display_name text not null,
          email text not null,
          password_hash text not null,
          seller_type text not null,
          public_slug text not null,
          public_status text not null,
          setup_completed boolean not null default false,
          notification_email text,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )
      `;
      await sql`
        create unique index if not exists sellers_email_lower_key on sellers (lower(email))
      `;
      await sql`
        create unique index if not exists sellers_public_slug_key on sellers (public_slug)
      `;
      await sql`
        create table if not exists seller_workspaces (
          seller_id text primary key references sellers(id) on delete cascade,
          workspace_json jsonb not null,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )
      `;
    })();
  }

  await schemaPromise;
}

export async function getSellerByEmail(email: string) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    return null;
  }

  const sql = getClient();
  const rows = await sql<SellerRow[]>`
    select
      id,
      display_name as "displayName",
      email,
      password_hash as "passwordHash",
      seller_type as "sellerType",
      public_slug as "publicSlug",
      public_status as "publicStatus",
      setup_completed as "setupCompleted",
      notification_email as "notificationEmail",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from sellers
    where lower(email) = lower(${email})
    limit 1
  `;

  return rows[0] ? mapSeller(rows[0]) : null;
}

export async function getSellerById(id: string) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    return null;
  }

  const sql = getClient();
  const rows = await sql<SellerRow[]>`
    select
      id,
      display_name as "displayName",
      email,
      password_hash as "passwordHash",
      seller_type as "sellerType",
      public_slug as "publicSlug",
      public_status as "publicStatus",
      setup_completed as "setupCompleted",
      notification_email as "notificationEmail",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from sellers
    where id = ${id}
    limit 1
  `;

  return rows[0] ? mapSeller(rows[0]) : null;
}

export async function getSellerByPublicSlug(publicSlug: string) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    return null;
  }

  const sql = getClient();
  const rows = await sql<SellerRow[]>`
    select
      id,
      display_name as "displayName",
      email,
      password_hash as "passwordHash",
      seller_type as "sellerType",
      public_slug as "publicSlug",
      public_status as "publicStatus",
      setup_completed as "setupCompleted",
      notification_email as "notificationEmail",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from sellers
    where lower(public_slug) = lower(${publicSlug})
    limit 1
  `;

  return rows[0] ? mapSeller(rows[0]) : null;
}

export async function isPublicSlugAvailable(publicSlug: string, sellerId?: string) {
  if (!publicSlug || isReservedPublicSlug(publicSlug)) {
    return false;
  }

  const existing = await getSellerByPublicSlug(publicSlug);

  return !existing || existing.id === sellerId;
}

export async function createSellerAccount(input: CreateSellerAccountInput) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const sql = getClient();
  const rows = await sql<SellerRow[]>`
    insert into sellers (
      id,
      display_name,
      email,
      password_hash,
      seller_type,
      public_slug,
      public_status,
      setup_completed,
      notification_email
    )
    values (
      ${input.id},
      ${input.displayName},
      ${input.email.toLowerCase()},
      ${input.passwordHash},
      ${input.sellerType},
      ${input.publicSlug},
      ${input.publicStatus ?? "private_preview"},
      ${input.setupCompleted ?? false},
      ${input.notificationEmail ?? input.email.toLowerCase()}
    )
    returning
      id,
      display_name as "displayName",
      email,
      password_hash as "passwordHash",
      seller_type as "sellerType",
      public_slug as "publicSlug",
      public_status as "publicStatus",
      setup_completed as "setupCompleted",
      notification_email as "notificationEmail",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  return mapSeller(rows[0] as SellerRow);
}

export async function saveSellerProfile(input: SaveSellerProfileInput) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const sql = getClient();
  const rows = await sql<SellerRow[]>`
    update sellers
    set
      display_name = ${input.displayName},
      email = ${input.email.toLowerCase()},
      seller_type = ${input.sellerType},
      public_slug = ${input.publicSlug},
      public_status = ${input.publicStatus ?? "private_preview"},
      setup_completed = ${input.setupCompleted ?? false},
      notification_email = ${input.notificationEmail ?? input.email.toLowerCase()},
      updated_at = now()
    where id = ${input.id}
    returning
      id,
      display_name as "displayName",
      email,
      password_hash as "passwordHash",
      seller_type as "sellerType",
      public_slug as "publicSlug",
      public_status as "publicStatus",
      setup_completed as "setupCompleted",
      notification_email as "notificationEmail",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  return rows[0] ? mapSeller(rows[0]) : null;
}

export async function getSellerWorkspace(sellerId: string) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    return null;
  }

  const sql = getClient();
  const rows = await sql<WorkspaceRow[]>`
    select
      seller_id as "sellerId",
      workspace_json as "workspaceJson",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from seller_workspaces
    where seller_id = ${sellerId}
    limit 1
  `;

  return rows[0] ? mapWorkspace(rows[0]) : null;
}

export async function saveSellerWorkspace(
  sellerId: string,
  workspaceJson: Record<string, unknown>,
) {
  await ensureDatabaseSchema();

  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const sql = getClient();
  const rows = await sql<WorkspaceRow[]>`
    insert into seller_workspaces (seller_id, workspace_json)
    values (${sellerId}, ${sql.json(workspaceJson as postgres.JSONValue)})
    on conflict (seller_id) do update
    set
      workspace_json = excluded.workspace_json,
      updated_at = now()
    returning
      seller_id as "sellerId",
      workspace_json as "workspaceJson",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  return mapWorkspace(rows[0] as WorkspaceRow);
}
