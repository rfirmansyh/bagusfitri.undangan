-- RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS rsvps_created_at_idx
ON rsvps (created_at DESC);

CREATE INDEX IF NOT EXISTS rsvps_ip_address_idx
ON rsvps (ip_address, created_at DESC);

-- Wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  hidden_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS wishes_created_at_idx
ON wishes (created_at DESC);

CREATE INDEX IF NOT EXISTS wishes_ip_address_idx
ON wishes (ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS wishes_hidden_at_idx
ON wishes (hidden_at, created_at DESC);
