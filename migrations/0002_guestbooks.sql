-- Guestbooks table
CREATE TABLE IF NOT EXISTS guestbooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  signature TEXT NOT NULL UNIQUE,
  link TEXT NOT NULL,
  chat_template TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS guestbooks_signature_idx
ON guestbooks (signature);

CREATE INDEX IF NOT EXISTS guestbooks_name_idx
ON guestbooks (name);

CREATE INDEX IF NOT EXISTS guestbooks_created_at_idx
ON guestbooks (created_at DESC);
