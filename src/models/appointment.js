const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  carwash: { type: String, required: true },
});

// Agregar índices si es necesario
appointmentSchema.index({ date: 1, time: 1, carwash: 1, });

module.exports = mongoose.model("Appointment", appointmentSchema);
