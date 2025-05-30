// Neon Database Plugin for web3db-connector
import postgresql from "pg";
import logger from "../../logger/index.js";
import { parse as parseConnectionString } from "pg-connection-string";

const { Pool } = postgresql;

export default class NeonDatabasePlugin {
  constructor() {
    this.pools = {}; // Store connection pools for different contexts
    this.connectionStatus = {}; // Track connection status for each context
    this.availableTables = {}; // Track available tables for each context
  }

  /**
   * Initialize all hooks used by this plugin
   */
  async init() {
    return {
      HOOKS: {
        connect: () => this.connectToDatabase(),
        query: (params) => this.executeQuery(params)
      }
    };
  }

  /**
   * Connect to the Neon database using the provided connection string
   */
  async connectToDatabase() {
    if (!this.connection_string) {
      logger.error("No connection string provided for Neon database plugin");
      this.updateConnectionStatus("error", "No connection string provided");
      return false;
    }

    try {
      // Parse the connection string to extract components
      const connConfig = parseConnectionString(this.connection_string);
      
      // Create connection pool with additional parameters if provided
      const poolConfig = {
        connectionString: this.connection_string,
        ssl: this.ssl_mode === "disable" ? false : { rejectUnauthorized: this.ssl_mode === "require" },
        max: this.max_pool_size || 10,
        idleTimeoutMillis: this.idle_timeout_millis || 30000
      };
      
      // Create or update the connection pool for this context
      this.pools[this.uuid] = new Pool(poolConfig);
      
      // Test the connection by querying for PostgreSQL version
      const client = await this.pools[this.uuid].connect();
      const result = await client.query('SELECT version()');
      client.release();
      
      this.updateConnectionStatus("success", "Connected to Neon database");
      
      // Get available tables in the database
      await this.listTables();
      
      return true;
    } catch (error) {
      logger.error("Failed to connect to Neon database:", error.message);
      this.updateConnectionStatus("error", `Connection failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Update connection status dynamic variable
   */
  updateConnectionStatus(status, message) {
    this.connectionStatus[this.uuid] = {
      status,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Update dynamic variables
    if (global.connectionEvents && global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES) {
      global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES.emit({
        plugin_id: "neon-database",
        uuid: this.uuid,
        dynamic_variables: [
          {
            name: "Connection Status",
            type: "badge",
            value: message,
            className: status === "success" ? "bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full" : 
                     "bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full"
          }
        ]
      });
    }
  }

  /**
   * List available tables in the database
   */
  async listTables() {
    if (!this.pools[this.uuid]) {
      return [];
    }
    
    try {
      const schema = this.schema || "public";
      const client = await this.pools[this.uuid].connect();
      
      const query = `
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = $1
        ORDER BY table_name, ordinal_position;
      `;
      
      const result = await client.query(query, [schema]);
      client.release();
      
      // Process results to group columns by table
      const tables = {};
      result.rows.forEach(row => {
        if (!tables[row.table_name]) {
          tables[row.table_name] = { columns: [] };
        }
        tables[row.table_name].columns.push({
          name: row.column_name,
          type: row.data_type
        });
      });
      
      // Convert to array and store
      const tablesArray = Object.entries(tables).map(([name, info]) => ({
        name,
        columns: info.columns
      }));
      
      this.availableTables[this.uuid] = tablesArray;
      
      // Update dynamic variables with available tables
      if (global.connectionEvents && global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES) {
        const tablesList = tablesArray.map(table => ({
          title: `${table.name} (${table.columns.length} columns)`,
          color: "blue"
        }));
        
        global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES.emit({
          plugin_id: "neon-database",
          uuid: this.uuid,
          dynamic_variables: [
            {
              name: "Available Tables",
              type: "logs",
              value: tablesList
            }
          ]
        });
      }
      
      return tablesArray;
    } catch (error) {
      logger.error("Error listing tables:", error.message);
      return [];
    }
  }

  /**
   * Execute a SQL query on the Neon database
   */
  async executeQuery({ query, params }) {
    if (!this.pools[this.uuid]) {
      logger.error("No active connection pool for this context");
      return { error: "No active database connection" };
    }
    
    try {
      const client = await this.pools[this.uuid].connect();
      const result = await client.query(query, params || []);
      client.release();
      
      return {
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map(f => ({
          name: f.name,
          dataTypeID: f.dataTypeID
        }))
      };
    } catch (error) {
      logger.error("Error executing query:", error.message);
      return { error: error.message };
    }
  }

  /**
   * Import schema from Neon to Ceramic models
   */
  async importSchema(tableName) {
    if (!this.pools[this.uuid] || !tableName) {
      return { error: "No active database connection or table name not provided" };
    }
    
    try {
      const client = await this.pools[this.uuid].connect();
      const schema = this.schema || "public";
      
      // Get table columns
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await client.query(columnsQuery, [schema, tableName]);
      client.release();
      
      // Convert PostgreSQL types to GraphQL/Ceramic types
      const schemaDefinition = {
        name: tableName,
        fields: columnsResult.rows.map(column => {
          let type = "String"; // Default type
          
          // Map PostgreSQL types to Ceramic model types
          switch (column.data_type.toLowerCase()) {
            case 'integer':
            case 'smallint':
            case 'bigint':
              type = "Integer";
              break;
            case 'numeric':
            case 'decimal':
            case 'real':
            case 'double precision':
              type = "Float";
              break;
            case 'boolean':
              type = "Boolean";
              break;
            case 'json':
            case 'jsonb':
              type = "Object";
              break;
            case 'timestamp':
            case 'date':
            case 'time':
              type = "DateTime";
              break;
            default:
              type = "String";
          }
          
          return {
            name: column.column_name,
            type: type,
            required: column.is_nullable === "NO"
          };
        })
      };
      
      // Create Ceramic model from the schema definition
      // This would typically call the Ceramic model creation API
      return schemaDefinition;
    } catch (error) {
      logger.error("Error importing schema:", error.message);
      return { error: error.message };
    }
  }

  /**
   * Gracefully stop the plugin and close database connections
   */
  async stop() {
    logger.debug("Stopping Neon database plugin:", this.uuid);
    
    // Close all connection pools
    if (this.pools[this.uuid]) {
      await this.pools[this.uuid].end();
      delete this.pools[this.uuid];
    }
  }
}
