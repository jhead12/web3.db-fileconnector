# PostgreSQL Permission Commands

Run the following commands in your PostgreSQL terminal to grant the necessary permissions to the 'admin' user for the 'ceramic' database:

```sql
-- Connect to PostgreSQL as superuser (usually 'postgres')
psql -U postgres

-- Once connected to PostgreSQL, run these commands:

-- Connect to the ceramic database
\c ceramic

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

-- Exit PostgreSQL
\q
```

## Alternative: Run as a Script

If you prefer to run this as a script instead of typing the commands manually, you can:

1. Save the following content to a file named `fix-permissions.sql`:

```sql
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
```

2. Run the script with:

```bash
psql -U postgres -d ceramic -f fix-permissions.sql
```

## Verification

After applying these permissions, you can verify them by:

1. Connecting as the admin user:

```bash
psql -U admin -d ceramic
```

2. Trying to create a test table:

```sql
CREATE TABLE test_permissions (id SERIAL PRIMARY KEY, name TEXT);
DROP TABLE test_permissions; -- Clean up after testing
```

If you can create and drop the test table without errors, the permissions have been successfully applied.
