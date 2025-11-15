import express from "express";
import PlatosRouter from "./routes/platos.router.js";
import AuthRouter from "./routes/auth.router.js";
import PedidosRouter from "./routes/pedidos.router.js";
import cors from "cors";
import "dotenv/config";
import { sequelize } from "./db.js";
import "./models/index.js"; // Importar modelos y relaciones

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("BurgerTIC API is running..."));

app.use("/platos", PlatosRouter);
app.use("/auth", AuthRouter);
app.use("/pedidos", PedidosRouter);

// Sincronizar modelos con la base de datos
try {
    await sequelize.sync({ force: false }); // Cambiar a true solo si quieres recrear las tablas
    console.log("Database models synchronized successfully.");
} catch (error) {
    console.error("Error synchronizing database models:", error);
}

app.listen(process.env.PORT || 9000, () =>
    console.log(`Server is running on port ${process.env.PORT || 9000}`)
);
