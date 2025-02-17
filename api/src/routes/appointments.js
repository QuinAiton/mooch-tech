const router = require("express").Router();

module.exports = (db, updateAppointment) => {
  router.get("/appointments", async (request, response) => {
    try {
      const { rows: appointments } = await db.query(`
        SELECT
          appointments.id,
          appointments.time,
          CASE WHEN interviews.id IS NULL
          THEN NULL
          ELSE json_build_object('student', interviews.student, 'interviewer', interviews.interviewer_id)
          END AS interview
        FROM appointments
        LEFT JOIN interviews ON interviews.appointment_id = appointments.id
        GROUP BY appointments.id, interviews.id, interviews.student, interviews.interviewer_id
        ORDER BY appointments.id
      `);
      const result = appointments.reduce(
        (previous, current) => ({ ...previous, [current.id]: current }),
        {}
      );
      response.json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // TODO: Add ability to create and update appointments

  router.delete("/appointments/:id", async (request, response) => {
    if (process.env.TEST_ERROR) {
      setTimeout(() => response.status(500).json({}), 1000);
      return;
    }

    try {
      await db.query(`DELETE FROM interviews WHERE appointment_id = $1::integer`, [
        request.params.id,
      ]);
      setTimeout(() => {
        response.status(204).json({});
        updateAppointment(Number(request.params.id), null);
      }, 1000);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  return router;
};