#!/bin/bash

# Database Permissions Validation Script
# Checks if PostgreSQL permissions are properly configured for web3.db-fileconnector

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_header "DATABASE PERMISSIONS VALIDATION"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL client (psql) is not installed or not in PATH"
    exit 1
fi

print_status "Checking PostgreSQL connection..."

# Test connection to ceramic database
if psql -U admin -d ceramic -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Successfully connected to ceramic database as admin"
else
    print_error "Cannot connect to ceramic database as admin user"
    print_status "Make sure PostgreSQL is running and the admin user exists"
    exit 1
fi

print_header "PERMISSION CHECKS"

# Check schema usage permissions
print_status "Checking schema usage permissions..."
SCHEMA_USAGE=$(psql -U admin -d ceramic -t -c "SELECT has_schema_privilege('admin', 'public', 'USAGE');" 2>/dev/null | tr -d ' \n')
if [ "$SCHEMA_USAGE" = "t" ]; then
    print_success "✓ Schema USAGE permission granted"
else
    print_error "✗ Schema USAGE permission missing"
    PERMISSION_ERRORS=true
fi

# Check schema create permissions
print_status "Checking schema create permissions..."
SCHEMA_CREATE=$(psql -U admin -d ceramic -t -c "SELECT has_schema_privilege('admin', 'public', 'CREATE');" 2>/dev/null | tr -d ' \n')
if [ "$SCHEMA_CREATE" = "t" ]; then
    print_success "✓ Schema CREATE permission granted"
else
    print_error "✗ Schema CREATE permission missing"
    PERMISSION_ERRORS=true
fi

# Check database ownership or superuser status
print_status "Checking database ownership..."
DB_OWNER=$(psql -U admin -d ceramic -t -c "SELECT pg_catalog.pg_get_userbyid(d.datdba) FROM pg_catalog.pg_database d WHERE d.datname = 'ceramic';" 2>/dev/null | tr -d ' \n')
if [ "$DB_OWNER" = "admin" ]; then
    print_success "✓ Admin user owns the ceramic database"
else
    print_warning "⚠ Admin user does not own the database (owner: $DB_OWNER)"
    print_status "This may cause issues with some operations"
fi

# Check for vector extension (if tables exist)
print_status "Checking for vector extension..."
VECTOR_EXT=$(psql -U admin -d ceramic -t -c "SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | tr -d ' \n')
if [ "$VECTOR_EXT" -gt 0 ]; then
    print_success "✓ Vector extension is installed"
else
    print_warning "⚠ Vector extension not found (may be installed later)"
fi

# Test table creation capability
print_status "Testing table creation capability..."
if psql -U admin -d ceramic -c "CREATE TABLE permission_test (id SERIAL PRIMARY KEY, test_data TEXT); DROP TABLE permission_test;" > /dev/null 2>&1; then
    print_success "✓ Table creation test passed"
else
    print_error "✗ Cannot create tables - check permissions"
    PERMISSION_ERRORS=true
fi

print_header "VALIDATION RESULTS"

if [ "$PERMISSION_ERRORS" = true ]; then
    print_error "Permission validation FAILED!"
    echo
    print_status "To fix permissions, run:"
    echo "  psql -U postgres -d ceramic -f fix-postgres-permissions.sql"
    echo
    print_status "Or follow the manual setup in PostgreSQL-Permissions.md"
    exit 1
else
    print_success "All permission checks PASSED!"
    print_status "Your database is properly configured for web3.db-fileconnector"
fi

print_header "SETUP VERIFICATION COMPLETE"

exit 0
