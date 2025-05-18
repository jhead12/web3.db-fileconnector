import fs from "fs";
import path from "path";

/** Will enable the selected preset */
export async function enablePreset(type, slot) {
  console.log("Enter enablePreset for type: " + type + " / and slot: " + slot);

  let db;
  if (slot) {
    console.log(
      "global.indexingService.databases[slot]:",
      global.indexingService.databases[slot],
    );
    db = global.indexingService.databases[slot];
  } else {
    console.log(
      "global.indexingService.database:",
      global.indexingService.database,
    );
    db = global.indexingService.database;
  }
  
  // Check if db is defined before proceeding
  if (!db) {
    console.log("Database not found for slot:", slot);
    return;
  }

  try {
    // Load the preset JSON file
    const presetFilePath = path.resolve(
      `./server/presets/definitions/${type}.json`,
    );
    
    if (!fs.existsSync(presetFilePath)) {
      console.log(`Preset file not found: ${presetFilePath}`);
      return;
    }
    
    const presetData = JSON.parse(fs.readFileSync(presetFilePath, "utf-8"));

    // Execute preset models and views
    if (presetData.models && Array.isArray(presetData.models)) {
      for (const model of presetData.models) {
        try {
          await db.indexModel(model);
        } catch (error) {
          console.log(`Error indexing model: ${error.message}`);
        }
      }
    }

    if (presetData.views && Array.isArray(presetData.views)) {
      for (const view of presetData.views) {
        try {
          await db.query(view.query);
        } catch (error) {
          console.log(`Error executing view query: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.log(`Error enabling preset ${type}: ${error.message}`);
  }

  return;
}
