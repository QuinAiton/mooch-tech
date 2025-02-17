const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const db = require("./db");

const days = require("./routes/days");
const appointments = require("./routes/appointments");
const interviewers = require("./routes/interviewers");

function read(file) {
  return fs.promises.readFile(file, { encoding: "utf-8" });
}

module.exports = function application(
  ENV,
  actions = { updateAppointment: () => { } }
) {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  app.use("/api", days(db));
  app.use("/api", appointments(db, actions.updateAppointment));
  app.use("/api", interviewers(db));

  if (ENV === "development" || ENV === "test") {
    const setupResetRoute = async () => {
      try {
        const create = await read(path.resolve(__dirname, `db/schema/create.sql`));
        const seed = await read(path.resolve(__dirname, `db/schema/${ENV}.sql`));

        app.get("/api/debug/reset", async (request, response) => {
          try {
            await db.query(create);
            await db.query(seed);
            console.log("Database Reset");
            response.status(200).send("Database Reset");
          } catch (error) {
            console.error("Error resetting the database:", error);
            response.status(500).send("Error resetting the database");
          }
        });
      } catch (error) {
        console.log(`Error setting up the reset route: ${error}`);
      }
    };

    setupResetRoute();
  }

  app.close = function () {
    return db.end();
  };

  return app;
};