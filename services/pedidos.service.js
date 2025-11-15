import { Pedido, PlatoXPedido, Plato, Usuario } from "../models/index.js";

const getPlatosByPedido = async (idPedido) => {
    try {
        const platosXPedido = await PlatoXPedido.findAll({
            where: { id_pedido: idPedido },
            include: [{
                model: Plato,
                attributes: ['id', 'nombre', 'tipo', 'precio', 'descripcion']
            }]
        });

        return platosXPedido.map(item => ({
            id: item.Plato.id,
            nombre: item.Plato.nombre,
            tipo: item.Plato.tipo,
            precio: item.Plato.precio,
            descripcion: item.Plato.descripcion,
            cantidad: item.cantidad
        }));
    } catch (error) {
        throw new Error(`Error al obtener platos del pedido: ${error.message}`);
    }
};

const getPedidos = async () => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'nombre', 'apellido', 'email']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        // Para cada pedido, obtener los platos
        const pedidosConPlatos = await Promise.all(
            pedidos.map(async (pedido) => {
                const platos = await getPlatosByPedido(pedido.id);
                return {
                    ...pedido.toJSON(),
                    platos
                };
            })
        );

        return pedidosConPlatos;
    } catch (error) {
        throw new Error(`Error al obtener pedidos: ${error.message}`);
    }
};

const getPedidoById = async (id) => {
    try {
        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'nombre', 'apellido', 'email']
                }
            ]
        });

        if (!pedido) {
            return null;
        }

        const platos = await getPlatosByPedido(id);
        
        return {
            ...pedido.toJSON(),
            platos
        };
    } catch (error) {
        throw new Error(`Error al obtener pedido: ${error.message}`);
    }
};

const getPedidosByUser = async (idUsuario) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { id_usuario: idUsuario },
            order: [['fecha', 'DESC']]
        });

        // Para cada pedido, obtener los platos
        const pedidosConPlatos = await Promise.all(
            pedidos.map(async (pedido) => {
                const platos = await getPlatosByPedido(pedido.id);
                return {
                    ...pedido.toJSON(),
                    platos
                };
            })
        );

        return pedidosConPlatos;
    } catch (error) {
        throw new Error(`Error al obtener pedidos del usuario: ${error.message}`);
    }
};

const createPedido = async (idUsuario, platos) => {
    try {
        // 1. Validar que los platos existan y tengan cantidad válida
        if (!platos || !Array.isArray(platos) || platos.length === 0) {
            throw new Error("Debe incluir al menos un plato en el pedido");
        }

        // Validar cada plato
        for (const platoItem of platos) {
            if (!platoItem.id || !platoItem.cantidad) {
                throw new Error("Cada plato debe tener id y cantidad");
            }

            if (platoItem.cantidad <= 0) {
                throw new Error("La cantidad debe ser mayor a 0");
            }

            // Verificar que el plato existe
            const platoExiste = await Plato.findByPk(platoItem.id);
            if (!platoExiste) {
                throw new Error(`El plato con id ${platoItem.id} no existe`);
            }
        }

        // 2. Crear el pedido
        const nuevoPedido = await Pedido.create({
            id_usuario: idUsuario,
            fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            estado: "pendiente"
        });

        // 3. Agregar los platos al pedido
        const platosXPedido = platos.map(plato => ({
            id_pedido: nuevoPedido.id,
            id_plato: plato.id,
            cantidad: plato.cantidad
        }));

        await PlatoXPedido.bulkCreate(platosXPedido);

        // Devolver el pedido completo con platos
        return await getPedidoById(nuevoPedido.id);
    } catch (error) {
        throw new Error(`Error al crear pedido: ${error.message}`);
    }
};

const updatePedido = async (id, estado) => {
    try {
        const estadosValidos = ["pendiente", "aceptado", "en camino", "entregado"];
        
        if (!estadosValidos.includes(estado)) {
            throw new Error("Estado inválido");
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            throw new Error("Pedido no encontrado");
        }

        // Validar transiciones de estado
        const { estado: estadoActual } = pedido;
        
        // Lógica de validación de transiciones
        if (estadoActual === "entregado") {
            throw new Error("No se puede modificar un pedido ya entregado");
        }

        await Pedido.update(
            { estado },
            { where: { id } }
        );

        return await getPedidoById(id);
    } catch (error) {
        throw new Error(`Error al actualizar pedido: ${error.message}`);
    }
};

const deletePedido = async (id) => {
    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            throw new Error("Pedido no encontrado");
        }

        // Eliminar primero los registros de PlatoXPedido
        await PlatoXPedido.destroy({
            where: { id_pedido: id }
        });

        // Luego eliminar el pedido
        await Pedido.destroy({
            where: { id }
        });

        return { message: "Pedido eliminado exitosamente" };
    } catch (error) {
        throw new Error(`Error al eliminar pedido: ${error.message}`);
    }
};

export default {
    getPlatosByPedido,
    getPedidos,
    getPedidoById,
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
};
