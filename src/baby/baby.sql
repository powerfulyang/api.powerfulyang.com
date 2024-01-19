DROP TABLE IF EXISTS baby_event_log;
DROP TABLE IF EXISTS baby_event;
DROP TABLE IF EXISTS baby_moments_to_uploads;
DROP TABLE IF EXISTS baby_moment;
DROP TABLE IF EXISTS baby;
DROP TABLE IF EXISTS r2_upload;
DROP TABLE IF EXISTS r2_bucket;


CREATE TABLE baby_event
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT NOT NULL,
  extra_fields jsonb NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL
);

CREATE UNIQUE INDEX event_name_unique ON baby_event (name);

CREATE TABLE baby_event_log
(
  id SERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  comment TEXT DEFAULT '' NOT NULL,
  extra jsonb NOT NULL,
  event_time timestamptz default now() NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL,
  FOREIGN KEY (event_name) REFERENCES baby_event (name) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE baby_moment
(
  id SERIAL PRIMARY KEY,
  type TEXT DEFAULT 'moment' NOT NULL,
  content TEXT DEFAULT '' NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL
);

CREATE TABLE r2_bucket
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL
);

CREATE UNIQUE INDEX bucket_name_unique ON r2_bucket (name);

CREATE TABLE r2_upload
(
  id SERIAL PRIMARY KEY,
  hash TEXT NOT NULL,
  thumbnail_hash TEXT DEFAULT '' NOT NULL,
  bucket_name TEXT NOT NULL,
  media_type TEXT NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL,
  FOREIGN KEY (bucket_name) REFERENCES r2_bucket (name) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE baby
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  born_at timestamptz default now() NOT NULL,
  gender INTEGER DEFAULT 0 NOT NULL,
  avatar INTEGER NOT NULL,
  created_at timestamptz default now() NOT NULL,
  updated_at timestamptz default now() NOT NULL,
  FOREIGN KEY (avatar) REFERENCES r2_upload (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE baby_moments_to_uploads
(
  moment_id INTEGER NOT NULL,
  upload_id INTEGER NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY (moment_id, upload_id),
  FOREIGN KEY (moment_id) REFERENCES baby_moment (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (upload_id) REFERENCES r2_upload (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
