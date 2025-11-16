import { Pedido, PlatoXPedido, Plato, Usuario } from "../models/index.js";

const getPlatosByPedido = async (idPedido) => {
    try {
        const platosXPedido = await PlatoXPedido.findAll({
            where: { id_pedido: idPedido },
            include: [{
                model: Plato,
                as: 'plato',
                attributes: ['id', 'nombre', 'tipo', 'precio', 'descripcion']
            }]
        });

        return platosXPedido.map(item => ({
            id: item.plato.id,
            nombre: item.plato.nombre,
            tipo: item.plato.tipo,
            precio: item.plato.precio,
            descripcion: item.plato.descripcion,
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
                    as: 'usuario',
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
                    as: 'usuario',
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
    console.log('🔧 PEDIDOS SERVICE - createPedido iniciado');
    console.log('👤 ID Usuario recibido:', idUsuario);
    console.log('🍔 Platos recibidos:', JSON.stringify(platos, null, 2));
    
    try {
        // 1. Validar que los platos existan y tengan cantidad válida
        if (!platos || !Array.isArray(platos) || platos.length === 0) {
            console.log('❌ Error: Platos inválidos');
            throw new Error("Debe incluir al menos un plato en el pedido");
        }

        console.log('✅ Validación inicial de platos OK');

        // Validar cada plato
        for (const platoItem of platos) {
            console.log('🔍 Validando plato individual:', platoItem);
            
            if (!platoItem.id || !platoItem.cantidad) {
                console.log('❌ Error: Plato sin id o cantidad');
                throw new Error("Cada plato debe tener id y cantidad");
            }

            if (platoItem.cantidad <= 0) {
                console.log('❌ Error: Cantidad inválida');
                throw new Error("La cantidad debe ser mayor a 0");
            }

            // Verificar que el plato existe
            console.log(`🔍 Buscando plato con ID: ${platoItem.id}`);
            const platoExiste = await Plato.findByPk(platoItem.id);
            if (!platoExiste) {
                console.log(`❌ Error: Plato ${platoItem.id} no encontrado`);
                throw new Error(`El plato con id ${platoItem.id} no existe`);
            }
            console.log(`✅ Plato ${platoItem.id} encontrado:`, platoExiste.nombre);
        }

        console.log('✅ Todos los platos validados correctamente');

        // 2. Crear el pedido
        console.log('💾 Creando pedido en base de datos...');
        const nuevoPedido = await Pedido.create({
            id_usuario: idUsuario,
            fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            estado: "pendiente"
        });
        console.log('✅ Pedido creado:', nuevoPedido.id);

        // 3. Agregar los platos al pedido
        console.log('🔗 Creando relaciones plato-pedido...');
        const platosXPedido = platos.map(plato => ({
            id_pedido: nuevoPedido.id,
            id_plato: plato.id,
            cantidad: plato.cantidad
        }));
        console.log('📋 Relaciones a crear:', platosXPedido);

        await PlatoXPedido.bulkCreate(platosXPedido);
        console.log('✅ Relaciones creadas exitosamente');

        // Devolver el pedido completo con platos
        console.log('📥 Obteniendo pedido completo...');
        const pedidoCompleto = await getPedidoById(nuevoPedido.id);
        console.log('✅ Pedido completo obtenido');
        
        return pedidoCompleto;
    } catch (error) {
        console.error('💥 ERROR en createPedido service:', error);
        console.error('🔍 Error stack:', error.stack);
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
