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

// Endpoint temporal para debug - ELIMINAR EN PRODUCCIÓN
app.get("/debug/users", async (req, res) => {
    try {
        const { Usuario } = await import('./models/index.js');
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'apellido', 'email', 'admin', 'password']
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint temporal para crear admin manualmente - ELIMINAR EN PRODUCCIÓN
app.post("/debug/create-admin", async (req, res) => {
    try {
        const { Usuario } = await import('./models/index.js');
        
        // Eliminar admin existente si existe
        await Usuario.destroy({ where: { email: 'admin@burgertic.com' } });
        
        // Crear nuevo admin
        const admin = await Usuario.create({
            nombre: 'Admin',
            apellido: 'BurgerTIC',
            email: 'admin@burgertic.com',
            password: 'admin123',
            admin: true
        });
        
        res.json({ message: 'Admin creado exitosamente', admin: admin.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/platos", PlatosRouter);
app.use("/auth", AuthRouter);
app.use("/pedidos", PedidosRouter);

// Sincronizar modelos con la base de datos
try {
    await sequelize.sync({ force: false });
    console.log("Database models synchronized successfully.");
    
    // Agregar datos de prueba si no existen
    await seedDatabase();
} catch (error) {
    console.error("Error synchronizing database models:", error);
}

// Función para poblar la base de datos con datos de prueba
async function seedDatabase() {
    try {
        const { Plato, Usuario } = await import('./models/index.js');
        
        // Agregar usuario admin si no existe
        const adminUser = await Usuario.findOne({ where: { email: 'admin@burgertic.com' } });
        if (!adminUser) {
            console.log("Creando usuario administrador...");
            await Usuario.create({
                nombre: 'Admin',
                apellido: 'BurgerTIC',
                email: 'admin@burgertic.com',
                password: 'admin123',
                admin: true
            });
            console.log("✅ Usuario administrador creado (admin@burgertic.com / admin123)");
        }
        
        const platosCount = await Plato.count();
        if (platosCount === 0) {
            console.log("Agregando platos de prueba...");
            
            await Plato.bulkCreate([
                {
                    tipo: 'principal',
                    nombre: 'Route 66 Classic',
                    descripcion: 'Hamburguesa clásica con carne jugosa, lechuga, tomate, cebolla y salsa especial',
                    precio: 12.99
                },
                {
                    tipo: 'principal', 
                    nombre: 'Texas BBQ Burger',
                    descripcion: 'Hamburguesa con carne a la parrilla, salsa BBQ, cebolla caramelizada y tocino',
                    precio: 15.99
                },
                {
                    tipo: 'principal',
                    nombre: 'Veggie Delight',
                    descripcion: 'Hamburguesa vegetariana con quinoa, champiñones, palta y brotes',
                    precio: 11.99
                },
                {
                    tipo: 'entrada',
                    nombre: 'Papas Fritas Clásicas',
                    descripcion: 'Papas fritas crujientes con sal marina',
                    precio: 4.99
                },
                {
                    tipo: 'entrada',
                    nombre: 'Aros de Cebolla',
                    descripcion: 'Aros de cebolla empanizados y fritos hasta la perfección',
                    precio: 5.99
                },
                {
                    tipo: 'bebida',
                    nombre: 'Cola Americana',
                    descripcion: 'Refrescante cola americana bien fría',
                    precio: 2.99
                },
                {
                    tipo: 'bebida',
                    nombre: 'Milkshake de Vainilla',
                    descripcion: 'Cremoso milkshake de vainilla con crema batida',
                    precio: 6.99
                },
                {
                    tipo: 'postre',
                    nombre: 'Apple Pie',
                    descripcion: 'Tradicional pastel de manzana americano con helado de vainilla',
                    precio: 7.99
                }
            ]);
            
            console.log("✅ Platos de prueba agregados correctamente.");
        } else {
            console.log(`ℹ️ La base de datos ya contiene ${platosCount} platos.`);
        }
    } catch (error) {
        console.error("Error adding seed data:", error);
    }
}

app.listen(process.env.PORT || 9000, () =>
    console.log(`Server is running on port ${process.env.PORT || 9000}`)
);
