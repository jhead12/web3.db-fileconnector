const fs = require("fs");
const path = require("path");

// Path to your global-utils.js file
const globalUtilsPath = "./client/global-utils.js";

console.log(`Reading ${globalUtilsPath}`);

try {
  // Read the contents of global-utils.js
  const globalUtilsContent = fs.readFileSync(globalUtilsPath, "utf8");
  console.log("Global Utils Content read");

  // Write the contents to a new file that Next.js can use
  const outputFilePath = path.join(__dirname, "output-global-utils.js");
  fs.writeFileSync(outputFilePath, `export default ${globalUtilsContent};`);
  console.log(`Bundled global-utils.js to ${outputFilePath}`);
} catch (err) {
  console.error("Error reading or writing file:", err);
}
