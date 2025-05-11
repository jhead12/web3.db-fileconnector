const fs = require("fs");
const { exec } = require("child_process");

// Create a log file in ./log/ceramic
const logFilePath = "./log/ceramic.log";
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

// Define the log function to write messages to the log file
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logFilePath, formattedMessage);
  console.log(formattedMessage);
}

// Define the system check function
async function systemCheck() {
  try {
    // Execute the necessary commands and write the output to the log file
    await exec("node ./server/system-check.js", (error, stdout, stderr) => {
      if (error) {
        log(`Error: ${error.message}`);
      } else {
        log(stdout);
      }
    });

    // Log that the system check completed successfully
    log("System check completed successfully");
  } catch (error) {
    log(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the system check function
systemCheck();
