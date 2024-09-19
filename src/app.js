const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const initConfig = async () => {
  const Config = require("./models/Config");
  try {
    await Config.findOneAndUpdate(
      { name: "availableTimes_carwash1" },
      { value: ["08:00", "10:00", "12:00", "14:00", "16:00"] },
      { upsert: true, new: true }
    );
    await Config.findOneAndUpdate(
      { name: "availableTimes_carwash2" },
      { value: ["09:00", "11:00", "13:00", "15:00", "17:00"] },
      { upsert: true, new: true }
    );

    console.log("Configuración inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la configuración:", error);
  }
};

const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

// Construye una ruta absoluta desde la raíz del proyecto
const projectRoot = path.resolve(__dirname, '..'); // Mueve un nivel hacia arriba
const indexPath = path.join(projectRoot, 'index.html');

// Servir el archivo 'index.html' en la raíz del proyecto
app.get('/', (req, res) => {
    res.sendFile(indexPath);
});



const PORT = process.env.PORT || 5000;

async function initializeServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    await initConfig();

    app.listen(PORT, () =>
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    );
  } catch (error) {
    console.error("Error al inicializar el servidor:", error);
    process.exit(1);
  }
}

initializeServer();
