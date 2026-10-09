import app from "./src/app.js";
import { dbConnected, dbDisconnect } from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnected();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await dbDisconnect();
        console.log("Database disconnected. Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();