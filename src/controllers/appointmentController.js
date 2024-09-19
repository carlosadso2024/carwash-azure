const Appointment = require("../models/appointment");
// Importa el modelo de configuración (asumiendo que lo has creado)
const Config = require("../models/Config");

exports.createAppointment = async (req, res) => {
  const { customerName, service, date, time, carwash } = req.body;

  if (!customerName || !service || !date || !time || !carwash) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Verifica si la hora está disponible
    const existingAppointment = await Appointment.findOne({ date, time, carwash });
    if (existingAppointment) {
      return res.status(400).json({ message: "La hora seleccionada ya no está disponible" });
    }

    // Crea la nueva cita
    const appointment = new Appointment({
      customerName,
      service,
      date,
      time,
      carwash
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error al crear la cita:', error);
    res.status(500).json({ message: "Error al crear la cita", error: error.message });
  }
};

//corregido por cursor
exports.getAvailableTimes = async (req, res) => {
  const { date, carwash } = req.query;

  if (!date || !carwash) {
    return res
      .status(400)
      .json({ message: "La fecha y el carwash son requeridos" });
  }

  try {
    // Obtén la configuración de horas para el carwash específico
    const config = await Config.findOne({ name: `availableTimes_${carwash}` });
    const allTimes = config
      ? config.value
      : ["08:00", "10:00", "12:00", "14:00", "16:00"];

    // Busca las citas existentes para la fecha y carwash seleccionados
    const appointments = await Appointment.find({ date, carwash });
    const bookedTimes = appointments.map((appt) => appt.time);

    // Filtra las horas disponibles
    const availableTimes = allTimes.filter(
      (time) => !bookedTimes.includes(time)
    );

    res.json({ availableTimes });
  } catch (error) {
    console.error("Error al obtener las horas disponibles:", error);
    res
      .status(500)
      .json({
        message: "Error al obtener las horas disponibles",
        error: error.message,
      });
  }
};

// Función para verificar la disponibilidad de la hora
async function isTimeSlotAvailable(date, time) {
  const existingAppointment = await Appointment.findOne({ date, time });
  return !existingAppointment; // Retorna true si el slot está disponible
}

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id); // Corregido
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json(appointment); // Corregido
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json({ message: "Cita eliminada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
