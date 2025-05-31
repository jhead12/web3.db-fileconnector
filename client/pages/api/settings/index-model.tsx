import { promises as fs } from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { createModelTable } from "../../../sdk/utils/data-utils"; // Adjust the import path as needed

// Use environment variable for settings file path
const settingsFilePath = path.resolve(
  process.env.SETTINGS_FILE_PATH ||
    path.join(process.cwd(), "orbisdb-settings.json")
);

// Status constants
const MODEL_STATUS = {
  INACTIVE: 0,
  PENDING: 1,
  ACTIVE: 2,
  ERROR: 3,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' not allowed` });
  }

  // JWT authentication
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionJwt = authorization.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not set in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    jwt.verify(sessionJwt, jwtSecret);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }

  const { modelId } = req.body;

  // Validate modelId
  if (!modelId || typeof modelId !== "string") {
    return res.status(400).json({ error: "Invalid or missing modelId" });
  }

  try {
    // Initialize settings file if it doesn't exist
    let settings = { models: [] };
    if (await fs.access(settingsFilePath).catch(() => false)) {
      settings = JSON.parse(await fs.readFile(settingsFilePath, "utf8"));
    }

    // Optional: Validate modelId with Ceramic
    const ceramicUrl =
      process.env.CERAMIC_NODE_URL || "https://ceramic-clay.3boxlabs.com";
    try {
      const ceramic = new CeramicClient(ceramicUrl);
      // Verify modelId is a valid stream ID (example)
      await ceramic.loadStream(modelId);
    } catch (error) {
      console.error("Ceramic stream validation failed:", error);
      return res
        .status(400)
        .json({ error: `Invalid Ceramic stream ID: ${modelId}` });
    }

    // Find and update model
    const modelIndex = settings.models.findIndex(
      (model) => model.stream_id === modelId
    );

    if (modelIndex === -1) {
      return res
        .status(404)
        .json({ error: `Model with stream_id ${modelId} not found` });
    }

    settings.models[modelIndex].status = MODEL_STATUS.ACTIVE;
    console.log("Updated settings:", settings);

    // Write settings asynchronously
    await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));

    // Create database table for the model (example with pgvector)
    // You need to implement your own DB connection logic
    try {
      await createModelTable(modelId);
    } catch (dbError) {
      console.error("Failed to create model table:", dbError);
      settings.models[modelIndex].status = MODEL_STATUS.ERROR;
      await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
      return res.status(500).json({ error: "Failed to create model table" });
    }

    return res.status(200).json({
      message: "Model status updated to active",
      settings,
      modelId,
    });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return res
      .status(500)
      .json({ error: `Failed to update settings: ${error.message}` });
  }
}
