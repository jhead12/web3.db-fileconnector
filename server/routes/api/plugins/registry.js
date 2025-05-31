// Plugin Registry and Management API
// This service allows users to submit, validate, and manage plugins

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import extractZip from "extract-zip";
import rimraf from "rimraf";
import jwt from "jsonwebtoken";
import { requireAuth } from "../../middleware/auth.js";
import logger from "../../logger/index.js";

const router = express.Router();
const execPromise = util.promisify(exec);

// Plugin registry path
const PLUGINS_DIR = path.join(process.cwd(), "server", "plugins");
const TEMP_DIR = path.join(process.cwd(), "temp", "plugins");
const REGISTRY_PATH = path.join(PLUGINS_DIR, "registry.json");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configure upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept zip files
    if (
      file.mimetype === "application/zip" ||
      file.originalname.endsWith(".zip")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only ZIP files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * Get all registered plugins
 *
 * GET /api/plugins/registry
 */
router.get("/registry", requireAuth, async (req, res) => {
  try {
    // Check if registry file exists
    if (!fs.existsSync(REGISTRY_PATH)) {
      return res.json({ plugins: {} });
    }

    // Read registry file
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
    return res.json(registry);
  } catch (error) {
    logger.error("Error retrieving plugin registry:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve plugin registry" });
  }
});

/**
 * Get plugin details
 *
 * GET /api/plugins/registry/:id
 */
router.get("/registry/:id", requireAuth, async (req, res) => {
  try {
    const pluginId = req.params.id;

    // Check if registry file exists
    if (!fs.existsSync(REGISTRY_PATH)) {
      return res.status(404).json({ error: "Plugin registry not found" });
    }

    // Read registry file
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));

    // Check if plugin exists in registry
    if (!registry.plugins || !registry.plugins[pluginId]) {
      return res.status(404).json({ error: "Plugin not found in registry" });
    }

    return res.json({ plugin: registry.plugins[pluginId] });
  } catch (error) {
    logger.error("Error retrieving plugin details:", error);
    return res.status(500).json({ error: "Failed to retrieve plugin details" });
  }
});

/**
 * Upload and validate a new plugin
 *
 * POST /api/plugins/registry/submit
 * Body: multipart/form-data with 'plugin' field containing ZIP file
 * Optional query param: ?install=true to install the plugin if validation passes
 */
router.post(
  "/registry/submit",
  requireAuth,
  upload.single("plugin"),
  async (req, res) => {
    let extractedPath = "";

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No plugin file uploaded" });
      }

      const uploadedFilePath = req.file.path;
      const extractDir = path.join(TEMP_DIR, uuidv4());

      // Create extraction directory
      fs.mkdirSync(extractDir, { recursive: true });

      // Extract the ZIP file
      await extractZip(uploadedFilePath, { dir: extractDir });
      extractedPath = extractDir;

      // Check the extracted files to find the plugin directory
      // Plugin should contain at least settings.json
      const files = fs.readdirSync(extractDir);
      let pluginDir = extractDir;

      // If the ZIP contains a single directory, use that as the plugin directory
      if (
        files.length === 1 &&
        fs.statSync(path.join(extractDir, files[0])).isDirectory()
      ) {
        pluginDir = path.join(extractDir, files[0]);
      }

      // Check if settings.json exists
      const settingsPath = path.join(pluginDir, "settings.json");
      if (!fs.existsSync(settingsPath)) {
        return res.status(400).json({
          error: "Invalid plugin: settings.json not found",
        });
      }

      // Read the settings.json to get plugin ID
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      const pluginId = settings.id;

      if (!pluginId) {
        return res.status(400).json({
          error: "Invalid plugin: missing plugin ID in settings.json",
        });
      }

      // Run validator script on the extracted plugin
      const { stdout, stderr } = await execPromise(
        `python ${path.join(process.cwd(), "scripts", "plugin_validator.py")} --path "${pluginDir}"`
      );

      // Parse validation results
      const validationResults = {
        pluginId,
        pluginName: settings.name,
        validationOutput: stdout,
        validationErrors: stderr,
        passed:
          !stderr.includes("FAILED") &&
          stdout.includes("passed all validation checks"),
      };

      // If validation passed and install=true, install the plugin
      if (validationResults.passed && req.query.install === "true") {
        const targetDir = path.join(PLUGINS_DIR, pluginId);

        // Check if plugin already exists
        if (fs.existsSync(targetDir)) {
          // Backup existing plugin
          const backupDir = path.join(
            PLUGINS_DIR,
            `${pluginId}-backup-${Date.now()}`
          );
          fs.renameSync(targetDir, backupDir);
        }

        // Copy files to plugins directory
        fs.mkdirSync(targetDir, { recursive: true });
        copyRecursive(pluginDir, targetDir);

        // Add to registry
        await execPromise(
          `python ${path.join(process.cwd(), "scripts", "plugin_validator.py")} --id "${pluginId}" --register`
        );

        validationResults.installed = true;
      }

      return res.json(validationResults);
    } catch (error) {
      logger.error("Error processing plugin submission:", error);
      return res.status(500).json({
        error: "Failed to process plugin submission",
        details: error.message,
      });
    } finally {
      // Clean up uploaded file and extracted files
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (extractedPath && fs.existsSync(extractedPath)) {
        rimraf.sync(extractedPath);
      }
    }
  }
);

/**
 * Install a validated plugin
 *
 * POST /api/plugins/registry/install/:id
 */
router.post("/registry/install/:id", requireAuth, async (req, res) => {
  try {
    const pluginId = req.params.id;

    // Check if plugin exists in temp directory
    const tempPluginPath = path.join(TEMP_DIR, pluginId);
    if (!fs.existsSync(tempPluginPath)) {
      return res
        .status(404)
        .json({ error: "Plugin not found in temporary storage" });
    }

    // Validate the plugin again
    const { stdout, stderr } = await execPromise(
      `python ${path.join(process.cwd(), "scripts", "plugin_validator.py")} --path "${tempPluginPath}"`
    );

    // Check if validation passed
    const passed =
      !stderr.includes("FAILED") &&
      stdout.includes("passed all validation checks");
    if (!passed) {
      return res.status(400).json({
        error: "Plugin failed validation",
        validationOutput: stdout,
        validationErrors: stderr,
      });
    }

    // Install the plugin
    const targetDir = path.join(PLUGINS_DIR, pluginId);

    // Check if plugin already exists
    if (fs.existsSync(targetDir)) {
      // Backup existing plugin
      const backupDir = path.join(
        PLUGINS_DIR,
        `${pluginId}-backup-${Date.now()}`
      );
      fs.renameSync(targetDir, backupDir);
    }

    // Copy files to plugins directory
    fs.mkdirSync(targetDir, { recursive: true });
    copyRecursive(tempPluginPath, targetDir);

    // Add to registry
    await execPromise(
      `python ${path.join(process.cwd(), "scripts", "plugin_validator.py")} --id "${pluginId}" --register`
    );

    // Clean up temp files
    rimraf.sync(tempPluginPath);

    return res.json({
      success: true,
      message: `Plugin ${pluginId} installed successfully`,
    });
  } catch (error) {
    logger.error("Error installing plugin:", error);
    return res.status(500).json({
      error: "Failed to install plugin",
      details: error.message,
    });
  }
});

/**
 * Uninstall a plugin
 *
 * DELETE /api/plugins/registry/:id
 */
router.delete("/registry/:id", requireAuth, async (req, res) => {
  try {
    const pluginId = req.params.id;
    const pluginDir = path.join(PLUGINS_DIR, pluginId);

    // Check if plugin exists
    if (!fs.existsSync(pluginDir)) {
      return res.status(404).json({ error: "Plugin not found" });
    }

    // Create backup before removing
    const backupDir = path.join(
      PLUGINS_DIR,
      `${pluginId}-backup-${Date.now()}`
    );
    fs.renameSync(pluginDir, backupDir);

    // Update registry
    if (fs.existsSync(REGISTRY_PATH)) {
      const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));

      if (registry.plugins && registry.plugins[pluginId]) {
        delete registry.plugins[pluginId];
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
      }
    }

    return res.json({
      success: true,
      message: `Plugin ${pluginId} uninstalled successfully`,
      backup: backupDir,
    });
  } catch (error) {
    logger.error("Error uninstalling plugin:", error);
    return res.status(500).json({
      error: "Failed to uninstall plugin",
      details: error.message,
    });
  }
});

/**
 * Recursively copy files from source to target
 */
function copyRecursive(source, target) {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Copy files and subdirectories
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

export default router;

// In a JavaScript project, you can use the following npm scripts in your package.json:

// 1. To automatically fix linting errors:
//    "lint:fix": "eslint --fix ."

// 2. To run a check without fixing:
//    "lint": "eslint ."

// 3. To specifically target certain files or directories:
//    "lint:server": "eslint server/ --fix"

// 4. You can also integrate Prettier with ESLint:
//    "format": "prettier --write ."
//    "format:check": "prettier --check ."
