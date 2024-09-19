const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/available-times", appointmentController.getAvailableTimes);
router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
