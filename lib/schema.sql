-- AUSlots Rewards — PostgreSQL schema
-- Run once: psql -U auslots -d auslots -f schema.sql

CREATE TABLE IF NOT EXISTS shop_items (
  id            TEXT PRIMARY KEY,
  game_name     TEXT    NOT NULL,
  provider      TEXT    NOT NULL,
  spin_count    INTEGER NOT NULL DEFAULT 0,
  point_cost    INTEGER NOT NULL,
  inventory     INTEGER NOT NULL DEFAULT 0,
  max_inventory INTEGER NOT NULL DEFAULT 100,
  gradient      TEXT    NOT NULL DEFAULT '',
  provider_color TEXT   NOT NULL DEFAULT '',
  image_url     TEXT
);

CREATE TABLE IF NOT EXISTS redemptions (
  id               TEXT    PRIMARY KEY,
  username         TEXT    NOT NULL,
  item_id          TEXT    NOT NULL,
  item_name        TEXT    NOT NULL,
  spin_count       INTEGER NOT NULL DEFAULT 0,
  point_cost       INTEGER NOT NULL,
  redeemed_at      BIGINT  NOT NULL,
  status           TEXT    NOT NULL DEFAULT 'pending',
  fulfilled_at     BIGINT,
  rejected_at      BIGINT,
  rejection_reason TEXT,
  viper_spin_email TEXT,
  zesty_bet_info   TEXT,
  discord_username TEXT,
  info_submitted   BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS raffles (
  id          TEXT    PRIMARY KEY,
  title       TEXT    NOT NULL,
  prize       TEXT    NOT NULL,
  ticket_cost INTEGER NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'active',
  created_at  BIGINT  NOT NULL,
  ended_at    BIGINT,
  winner      TEXT
);

CREATE TABLE IF NOT EXISTS raffle_tickets (
  id           TEXT    PRIMARY KEY,
  raffle_id    TEXT    NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
  username     TEXT    NOT NULL,
  user_id      TEXT    NOT NULL,
  quantity     INTEGER NOT NULL,
  purchased_at BIGINT  NOT NULL,
  points_spent INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS hunts (
  id                 TEXT    PRIMARY KEY,
  starting_balance   NUMERIC NOT NULL,
  number_of_bonuses  INTEGER NOT NULL,
  ending_balance     NUMERIC,
  status             TEXT    NOT NULL DEFAULT 'active',
  started_at         BIGINT  NOT NULL,
  closed_at          BIGINT,
  ended_at           BIGINT,
  winner_guess_id    TEXT,
  cleared_at         BIGINT
);

CREATE TABLE IF NOT EXISTS hunt_guesses (
  id           TEXT    PRIMARY KEY,
  hunt_id      TEXT    NOT NULL,
  username     TEXT    NOT NULL,
  guess        NUMERIC NOT NULL,
  submitted_at BIGINT  NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule (
  day       TEXT    PRIMARY KEY,
  full_day  TEXT    NOT NULL,
  streamer  TEXT    NOT NULL,
  time      TEXT    NOT NULL,
  type      TEXT    NOT NULL,
  color     TEXT    NOT NULL,
  is_main   BOOLEAN NOT NULL DEFAULT TRUE,
  special   BOOLEAN DEFAULT FALSE,
  off       BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS streamers (
  username TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS stream_schedule (
  id    SERIAL PRIMARY KEY,
  date  TEXT   NOT NULL UNIQUE,
  medi  TEXT   NOT NULL DEFAULT 'OFF',
  layto TEXT   NOT NULL DEFAULT 'OFF',
  aus   TEXT   NOT NULL DEFAULT 'OFF'
);

-- Default schedule (insert only if table is empty)
INSERT INTO schedule (day, full_day, streamer, time, type, color, is_main, special, off)
VALUES
  ('MON', 'Monday',    'AUSlots',        '7PM AEST', 'Main Stream',    '#00ff87', TRUE,  FALSE, FALSE),
  ('TUE', 'Tuesday',   'AUSlots',        '7PM AEST', 'Main Stream',    '#00ff87', TRUE,  FALSE, FALSE),
  ('WED', 'Wednesday', 'AUSlots',        '7PM AEST', 'Main Stream',    '#00ff87', TRUE,  FALSE, FALSE),
  ('THU', 'Thursday',  'AUSlots',        '7PM AEST', 'Big Hunt Night', '#fbbf24', TRUE,  TRUE,  FALSE),
  ('FRI', 'Friday',    'AUSlots',        '7PM AEST', 'Main Stream',    '#00ff87', TRUE,  FALSE, FALSE),
  ('SAT', 'Saturday',  'Guest Streamer', 'TBD',      'Guest Night',    '#a78bfa', FALSE, FALSE, FALSE),
  ('SUN', 'Sunday',    '–',              '–',        'Rest Day',       '#444444', FALSE, FALSE, TRUE)
ON CONFLICT (day) DO NOTHING;

-- Default shop items (insert only if not present)
INSERT INTO shop_items (id, game_name, provider, spin_count, point_cost, inventory, max_inventory, gradient, provider_color, image_url)
VALUES
  ('1', 'Crazy Ex Girlfriend',    'NoLimit City',   50,  3000, 87, 100, 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)',    '#ff6b6b', '/images/crazy_ex_girlfriend.webp'),
  ('2', 'Chaos Crew 3',           'Hacksaw',        50,  3000, 91, 100, 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4c1d95 100%)',    '#a78bfa', '/images/chaos_crew_3.jpg'),
  ('3', 'Sweet Bonanza 1000',     'Pragmatic Play', 100, 3875, 45, 100, 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)',    '#fbbf24', '/images/sweet-bonanza-1000.png'),
  ('4', 'Gates of Olympus 1000',  'Pragmatic Play', 100, 3875, 62, 100, 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)',    '#60a5fa', '/images/gates-of-olympus-1000.png'),
  ('5', 'Wanted Dead or Wild',    'Hacksaw',        75,  4500, 18, 50,  'linear-gradient(135deg, #d4a574 0%, #a0522d 50%, #5c3317 100%)',    '#d4a574', '/images/wanted-dead-or-wild.jpg'),
  ('6', 'Sugar Rush 1000',        'Pragmatic Play', 50,  2500, 33, 100, 'linear-gradient(135deg, #f472b6 0%, #db2777 50%, #9d174d 100%)',    '#f472b6', '/images/sugar-rush-1000.jpg'),
  ('7', 'RIP City',               'Hacksaw',        25,  2000, 75, 100, 'linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #9a3412 100%)',    '#fb923c', '/images/rip-city.png'),
  ('8', 'Starlight Princess 1000','Pragmatic Play', 100, 3875, 55, 100, 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #581c87 100%)',    '#c084fc', '/images/starlight-princess-1000.png')
ON CONFLICT (id) DO NOTHING;
