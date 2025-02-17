const router = require("express").Router();

module.exports = db => {
  router.get("/interviewers", async (request, response) => {
    try {
      const { rows: interviewers } = await db.query(`SELECT * FROM interviewers`);
      const result = interviewers.reduce(
        (previous, current) => ({ ...previous, [current.id]: current }),
        {}
      );
      response.json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Failed to fetch interviewers" });
    }
  });

  return router;
};