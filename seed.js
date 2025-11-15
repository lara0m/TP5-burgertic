import { sequelize } from "./db.js";
import { Plato, Usuario, Pedido, PlatoXPedido } from "./models/index.js";
import bcryptjs from "bcryptjs";

const seedDatabase = async () => {
    try {
        // Sincronizar y limpiar la base de datos
        await sequelize.sync({ force: true });
        console.log("Database synced and cleared.");

        // Crear platos de ejemplo
        const platos = await Plato.bulkCreate([
            {
                tipo: "principal",
                nombre: "Hamburguesa Clásica",
                precio: 300,
                descripcion: "Hamburguesa de carne con lechuga, tomate y queso"
            },
            {
                tipo: "principal", 
                nombre: "Hamburguesa Deluxe",
                precio: 450,
                descripcion: "Hamburguesa doble carne con bacon, queso cheddar y salsa especial"
            },
            {
                tipo: "principal",
                nombre: "Hamburguesa Veggie",
                precio: 350,
                descripcion: "Hamburguesa vegetal con quinoa, lechuga y palta"
            },
            {
                tipo: "combo",
                nombre: "Combo Familiar",
                precio: 800,
                descripcion: "2 hamburguesas + papas grandes + 2 gaseosas"
            },
            {
                tipo: "combo",
                nombre: "Combo Individual",
                precio: 450,
                descripcion: "Hamburguesa + papas + gaseosa"
            },
            {
                tipo: "combo",
                nombre: "Combo Kids",
                precio: 320,
                descripcion: "Mini hamburguesa + papas chicas + jugo"
            },
            {
                tipo: "postre",
                nombre: "Helado de Vainilla",
                precio: 150,
                descripcion: "Helado artesanal de vainilla con salsa a elección"
            },
            {
                tipo: "postre",
                nombre: "Brownie con Helado",
                precio: 220,
                descripcion: "Brownie casero tibio con helado de vainilla"
            },
            {
                tipo: "postre",
                nombre: "Cheesecake",
                precio: 180,
                descripcion: "Tarta de queso con frutos rojos"
            },
            {
                tipo: "postre",
                nombre: "Milkshake Chocolate",
                precio: 190,
                descripcion: "Batido cremoso de chocolate con crema chantilly"
            }
        ]);

        console.log(`${platos.length} platos created.`);

        // Crear usuarios de ejemplo
        const usuarios = await Usuario.bulkCreate([
            {
                nombre: "Admin",
                apellido: "BurgerTIC",
                email: "admin@burgertic.com",
                password: "admin123",
                admin: true
            },
            {
                nombre: "Juan",
                apellido: "Pérez",
                email: "juan.perez@email.com", 
                password: "123456",
                admin: false
            },
            {
                nombre: "María",
                apellido: "González",
                email: "maria.gonzalez@email.com",
                password: "123456", 
                admin: false
            }
        ]);

        console.log(`${usuarios.length} usuarios created.`);

        // Crear pedidos de ejemplo
        const pedido1 = await Pedido.create({
            id_usuario: usuarios[1].id, // Juan
            fecha: "2024-11-15",
            estado: "pendiente"
        });

        const pedido2 = await Pedido.create({
            id_usuario: usuarios[2].id, // María
            fecha: "2024-11-14", 
            estado: "entregado"
        });

        // Agregar platos a los pedidos
        await PlatoXPedido.bulkCreate([
            { id_pedido: pedido1.id, id_plato: platos[0].id, cantidad: 2 }, // 2 Hamburguesas Clásicas
            { id_pedido: pedido1.id, id_plato: platos[6].id, cantidad: 1 }, // 1 Helado

            { id_pedido: pedido2.id, id_plato: platos[3].id, cantidad: 1 }, // 1 Combo Familiar
            { id_pedido: pedido2.id, id_plato: platos[7].id, cantidad: 2 }  // 2 Brownies
        ]);

        console.log("2 pedidos created with platos.");
        console.log("Database seeded successfully!");

        // Mostrar información de login
        console.log("\n--- Información de Login ---");
        console.log("Admin:");
        console.log("  Email: admin@burgertic.com");
        console.log("  Password: admin123");
        console.log("\nUsuario regular:");
        console.log("  Email: juan.perez@email.com");
        console.log("  Password: 123456");
        
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await sequelize.close();
    }
};

// Ejecutar el seeder
seedDatabase();