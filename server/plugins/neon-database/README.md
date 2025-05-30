# Neon Database Plugin

This plugin allows you to connect your web3db-connector to a remote Neon serverless PostgreSQL database.

## Overview

Neon is a fully managed serverless PostgreSQL service with a generous free tier. This plugin enables users to easily connect to their Neon database instances and use them as data sources within the web3db-connector ecosystem.

## Features

- Connect to Neon PostgreSQL databases
- View available tables and their schemas
- Execute custom SQL queries
- Import table schemas to create compatible Ceramic models
- Monitor connection status

## Configuration

The plugin requires the following configuration:

### Required Parameters

- **Connection String**: Your Neon database connection string (e.g., `postgresql://user:password@ep-cool-rain-123456.us-east-2.aws.neon.tech/neondb`)
- **Database Name**: The name of the database to connect to

### Optional Parameters

- **SSL Mode**: SSL connection mode (require, prefer, disable)
- **Max Pool Size**: Maximum number of clients in the connection pool
- **Idle Timeout**: Time in milliseconds before idle connections are closed
- **Schema**: PostgreSQL schema to use (defaults to "public")

## Usage

### Connecting to a Neon Database

1. Install the plugin from the plugins page
2. Provide your Neon connection string and database name
3. Configure SSL settings based on your Neon project configuration
4. Click "Connect" to establish a connection

### Viewing Available Tables

Once connected, the plugin will automatically list all available tables in your Neon database. You can view the table structure by clicking on individual table names.

### Executing Custom Queries

You can execute custom SQL queries against your Neon database using the query interface. This is useful for complex operations or data extraction.

### Importing Schemas

To create Ceramic models based on your existing Neon database tables:

1. Connect to your Neon database
2. Click "Import Schema" on a selected table
3. Review and confirm the generated Ceramic model definition
4. Save the model to use it in your web3db-connector applications

## Security Considerations

- Connection strings contain sensitive information. Ensure they are stored securely.
- Consider using connection pooling to optimize performance.
- Use read-only credentials when possible to minimize risk.
- Enable SSL for secure connections to your Neon database.

## Troubleshooting

### Common Issues

- **Connection Failed**: Verify your connection string is correct and that your IP is allowed in Neon's connection settings
- **SSL Issues**: Try changing the SSL mode if you encounter connection problems
- **Timeout Errors**: Increase connection timeout settings or check network connectivity

### Support

For additional help with this plugin, please refer to the web3db-connector documentation or contact support.
