-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO admin;

-- Grant create on schema
GRANT CREATE ON SCHEMA public TO admin;

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Make privileges apply to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;

-- Make admin the owner of the database (optional but recommended)
ALTER DATABASE ceramic OWNER TO admin;