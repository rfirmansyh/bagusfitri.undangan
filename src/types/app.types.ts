// ─── RSVP Types ─────────────────────────────────────────────────
export type TRsvp = {
  id: string;
  name: string;
  guests: number;
  ipAddress: string | null;
  createdAt: string;
};

export type TCreateRsvpInput = {
  name: string;
  guests: number;
};

export type TCreateRsvpPayload = TCreateRsvpInput;

// ─── Wish Types ─────────────────────────────────────────────────
export type TWish = {
  id: string;
  name: string;
  message: string;
  ipAddress: string | null;
  hiddenAt: string | null;
  createdAt: string;
};

export type TCreateWishInput = {
  name: string;
  message: string;
};

export type TCreateWishPayload = TCreateWishInput;

// ─── Public Wish (safe for client) ──────────────────────────────
export type TPublicWish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

// ─── Paginated Result ───────────────────────────────────────────
export type TPaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// ─── Dashboard Stats ────────────────────────────────────────────
export type TDashboardStats = {
  totalRsvps: number;
  totalGuests: number;
  totalWishes: number;
  totalVisibleWishes: number;
};

// ─── Admin Wish (includes moderation fields) ────────────────────
export type TAdminWish = TWish;

// ─── Admin RSVP ─────────────────────────────────────────────────
export type TAdminRsvp = TRsvp;

// ─── API Response ───────────────────────────────────────────────
export type TApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ─── Request Metadata (for IP tracking / rate limiting) ─────────
export type TRequestMetadata = {
  ipAddress: string | null;
  userAgent: string | null;
};

// ─── Database Row Types (snake_case from SQLite) ────────────────
export type TRsvpRow = {
  id: string;
  name: string;
  guests: number | string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type TWishRow = {
  id: string;
  name: string;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  hidden_at: string | null;
  created_at: string;
};

export type TCountRow = {
  count: number | string;
};

// ─── Guestbook Types ────────────────────────────────────────────
export type TGuestbook = {
  id: string;
  name: string;
  signature: string;
  link: string;
  chatTemplate: string;
  createdAt: string;
};

export type TGuestbookRow = {
  id: string;
  name: string;
  signature: string;
  link: string;
  chat_template: string;
  created_at: string;
};

export type TCreateGuestbookInput = {
  name: string;
};

export type TBulkImportResult = {
  imported: number;
  skipped: number;
  errors: string[];
};
