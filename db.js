import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");
} catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
}