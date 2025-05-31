// Route handlers for the Neon database plugin
import express from "express";
import logger from "../../../logger/index.js";
import { getPluginContext } from "../../../utils/helpers.js";

const router = express.Router();

/**
 * Get list of tables in the Neon database
 */
router.get("/tables", async (req, res) => {
  try {
    if (!req.context_uuid) {
      return res.status(400).json({ error: "Context UUID is required" });
    }

    // Get plugin instance
    const pluginContext = getPluginContext("neon-database", req.context_uuid);
    if (!pluginContext || !pluginContext.plugin) {
      return res.status(404).json({ error: "Plugin context not found" });
    }

    const tables = await pluginContext.plugin.listTables();
    return res.json({ tables });
  } catch (error) {
    logger.error("Error retrieving Neon database tables:", error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Execute a query on the Neon database
 */
router.post("/query", async (req, res) => {
  try {
    if (!req.context_uuid) {
      return res.status(400).json({ error: "Context UUID is required" });
    }

    const { query, params } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Get plugin instance
    const pluginContext = getPluginContext("neon-database", req.context_uuid);
    if (!pluginContext || !pluginContext.plugin) {
      return res.status(404).json({ error: "Plugin context not found" });
    }

    // Execute the query
    const result = await pluginContext.plugin.executeQuery({ query, params });
    return res.json(result);
  } catch (error) {
    logger.error("Error executing Neon database query:", error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Import schema from a Neon table to create a Ceramic model
 */
router.post("/import-schema", async (req, res) => {
  try {
    if (!req.context_uuid) {
      return res.status(400).json({ error: "Context UUID is required" });
    }

    const { tableName } = req.body;
    if (!tableName) {
      return res.status(400).json({ error: "Table name is required" });
    }

    // Get plugin instance
    const pluginContext = getPluginContext("neon-database", req.context_uuid);
    if (!pluginContext || !pluginContext.plugin) {
      return res.status(404).json({ error: "Plugin context not found" });
    }

    // Import the schema
    const schemaDefinition = await pluginContext.plugin.importSchema(tableName);
    return res.json({ schema: schemaDefinition });
  } catch (error) {
    logger.error("Error importing schema from Neon database:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
