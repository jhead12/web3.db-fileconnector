import { adminDidAuthMiddleware } from "../../../middleware/didAuthMiddleware.js";
import fs from "fs";

const parseLogName = (log) => {
  const split = log.split(".");
  const extension = split.pop();

  if (extension !== "log") {
    return false;
  }

  const level = split.pop();
  const date = split.pop().split("-");

  const dateH = `${date.pop()}:00`;
  const dateM = date.join("-");

  return {
    id: log,
    level,
    timestamp: new Date(`${dateM} ${dateH}`).getTime(),
  };
};

const sortLogs = (logs) => {
  const clone = [...logs];
  clone.sort((logA, logB) => logB.timestamp - logA.timestamp);
  return clone;
};
const listLogfiles = (level = false) => {
  try {
    const logs = fs
      .readdirSync("./server/logs")
      .map((log) => parseLogName(log))
      .filter((log) => log && (level ? log.level === level : true));

    return sortLogs(logs);
  } catch (e) {
    console.error(`Error listing log files: ${e.message}`);
    return [];
  }
};

export default async function (server, opts) {
  server.addHook("onRequest", adminDidAuthMiddleware);

  server.get("/", async (req, res) => {
    try {
      return {
        logs: listLogfiles(req.query.level),
        level: req.query.level || "all",
      };
    } catch (e) {
      console.error(`Error in logs/ endpoint: ${e.message}`);
      return res.internalServerError(`Error retrieving logs: ${e.message}`);
    }
  });

  server.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const logIds = listLogfiles().map((log) => log.id);

      if (!logIds.includes(id)) {
        return res.notFound(`Invalid log file provided: ${id}.`);
      }

      try {
        const log = fs
          .readFileSync(`./server/logs/${id}`)
          .toString()
          .split(/\r?\n/);

        const logs = [];
        for (const event of log) {
          if (!event) continue;
          
          try {
            logs.push(JSON.parse(event));
          } catch (e) {
            console.error(`Error parsing log entry: ${e.message}`);
            // Skip invalid JSON entries
          }
        }

        return {
          ...parseLogName(id),
          logs,
        };
      } catch (e) {
        console.error(`Error reading log file ${id}: ${e.message}`);
        return res.internalServerError(`Error reading log file: ${e.message}`);
      }
    } catch (e) {
      console.error(`Unexpected error in logs/:id endpoint: ${e.message}`);
      return res.internalServerError(`Unexpected error: ${e.message}`);
    }
  });
}
