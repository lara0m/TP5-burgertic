import PedidosService from "../services/pedidos.service.js";

const getPedidos = async (req, res) => {
    try {
        // 1. Utilizar el servicio de pedidos para obtener todos los pedidos
        const pedidos = await PedidosService.getPedidos();
        
        // 2. Devolver un json con los pedidos (status 200)
        res.status(200).json(pedidos);
    } catch (error) {
        // 3. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

const getPedidosByUser = async (req, res) => {
    try {
        // 1. Obtener id del usuario desde el token (agregado por el middleware)
        const idUsuario = req.usuario.id;
        
        // 2. Utilizar el servicio de pedidos para obtener los pedidos del usuario
        const pedidos = await PedidosService.getPedidosByUser(idUsuario);
        
        // 3. Devolver los pedidos (puede ser lista vacía)
        res.status(200).json(pedidos);
    } catch (error) {
        // 4. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

const getPedidoById = async (req, res) => {
    try {
        // 1. Obtener id de los parámetros de la request
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID del pedido es requerido" });
        }

        // 2. Utilizar el servicio de pedidos para obtener el pedido por id
        const pedido = await PedidosService.getPedidoById(id);
        
        // 3. Si el pedido no existe, devolver un mensaje de error (status 404)
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        // 4. Si el pedido existe, devolver un json con el pedido (status 200)
        res.status(200).json(pedido);
    } catch (error) {
        // 5. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

const createPedido = async (req, res) => {
    console.log('🛒 CREATE PEDIDO - Iniciando...');
    console.log('📋 Body recibido:', req.body);
    console.log('👤 Usuario desde token:', req.usuario);
    
    try {
        // 1. Verificar que el body de la request tenga el campo platos
        const { platos } = req.body;
        console.log('🍔 Platos extraídos:', platos);
        
        if (!platos) {
            console.log('❌ Error: Campo platos faltante');
            return res.status(400).json({ message: "El campo 'platos' es requerido" });
        }
        
        // 2. Verificar que el campo platos sea un array
        if (!Array.isArray(platos)) {
            console.log('❌ Error: Platos no es array');
            return res.status(400).json({ message: "El campo 'platos' debe ser un array" });
        }
        
        // 3. Verificar que el array de platos tenga al menos un producto
        if (platos.length === 0) {
            console.log('❌ Error: Array de platos vacío');
            return res.status(400).json({ message: "Debe incluir al menos un plato en el pedido" });
        }
        
        // 4. Verificar que todos los platos tengan un id y una cantidad
        for (const plato of platos) {
            console.log('🔍 Validando plato:', plato);
            if (!plato.id || !plato.cantidad) {
                console.log('❌ Error: Plato sin id o cantidad:', plato);
                return res.status(400).json({ 
                    message: "Cada plato debe tener 'id' y 'cantidad'" 
                });
            }
            
            if (plato.cantidad <= 0) {
                console.log('❌ Error: Cantidad inválida:', plato.cantidad);
                return res.status(400).json({ 
                    message: "La cantidad de cada plato debe ser mayor a 0" 
                });
            }
        }
        
        // 5. Obtener id del usuario desde el token
        const idUsuario = req.usuario.id;
        console.log('👤 ID Usuario para pedido:', idUsuario);
        
        // 6. Crear un pedido con los productos recibidos y el id del usuario
        console.log('💾 Llamando a PedidosService.createPedido...');
        const nuevoPedido = await PedidosService.createPedido(idUsuario, platos);
        console.log('✅ Pedido creado exitosamente:', nuevoPedido);
        
        // 7. Devolver un mensaje de éxito (status 201)
        res.status(201).json({
            message: "Pedido creado exitosamente",
            pedido: nuevoPedido
        });
    } catch (error) {
        // 8. Devolver un mensaje de error si algo falló (status 500)
        console.error('💥 ERROR en createPedido:', error);
        console.error('📋 Stack trace:', error.stack);
        console.error('🔍 Error message:', error.message);
        
        if (error.message.includes("no existe")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ 
            message: "Error interno del servidor",
            details: error.message 
        });
    }
};

const aceptarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID del pedido es requerido" });
        }
        
        // 1. Obtener el pedido por id
        const pedido = await PedidosService.getPedidoById(id);
        
        // 2. Si el pedido no existe, devolver un mensaje de error (status 404)
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        // 3. Verificar que el pedido esté en estado "pendiente"
        if (pedido.estado !== "pendiente") {
            return res.status(400).json({ 
                message: `No se puede aceptar un pedido en estado '${pedido.estado}'` 
            });
        }
        
        // 4. Actualizar el estado del pedido a "aceptado"
        const pedidoActualizado = await PedidosService.updatePedido(id, "aceptado");
        
        // 5. Devolver un mensaje de éxito (status 200)
        res.status(200).json({
            message: "Pedido aceptado exitosamente",
            pedido: pedidoActualizado
        });
    } catch (error) {
        // 6. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

const comenzarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID del pedido es requerido" });
        }
        
        // 1. Obtener el pedido por id
        const pedido = await PedidosService.getPedidoById(id);
        
        // 2. Si el pedido no existe, devolver un mensaje de error (status 404)
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        // 3. Verificar que el pedido esté en estado "aceptado"
        if (pedido.estado !== "aceptado") {
            return res.status(400).json({ 
                message: `No se puede comenzar un pedido en estado '${pedido.estado}'` 
            });
        }
        
        // 4. Actualizar el estado del pedido a "en camino"
        const pedidoActualizado = await PedidosService.updatePedido(id, "en camino");
        
        // 5. Devolver un mensaje de éxito (status 200)
        res.status(200).json({
            message: "Pedido comenzado exitosamente",
            pedido: pedidoActualizado
        });
    } catch (error) {
        // 6. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

const entregarPedido = async (req, res) => {
    console.log('🚛 ENTREGAR PEDIDO - Iniciando...');
    console.log('📦 ID del pedido:', req.params.id);
    
    try {
        const { id } = req.params;
        
        if (!id) {
            console.log('❌ ID del pedido faltante');
            return res.status(400).json({ message: "ID del pedido es requerido" });
        }
        
        // 1. Obtener el pedido por id
        console.log('🔍 Buscando pedido con ID:', id);
        const pedido = await PedidosService.getPedidoById(id);
        
        // 2. Si el pedido no existe, devolver un mensaje de error (status 404)
        if (!pedido) {
            console.log('❌ Pedido no encontrado');
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        console.log('📋 Pedido encontrado - Estado actual:', pedido.estado);
        
        // 3. Verificar que el pedido esté en estado "en camino"
        if (pedido.estado !== "en camino") {
            console.log(`❌ Estado incorrecto: ${pedido.estado} (se esperaba "en camino")`);
            return res.status(400).json({ 
                message: `No se puede entregar un pedido en estado '${pedido.estado}'` 
            });
        }
        
        // 4. Actualizar el estado del pedido a "entregado"
        console.log('📤 Actualizando estado a "entregado"...');
        const pedidoActualizado = await PedidosService.updatePedido(id, "entregado");
        
        console.log('✅ Pedido entregado exitosamente');
        // 5. Devolver un mensaje de éxito (status 200)
        res.status(200).json({
            message: "Pedido entregado exitosamente",
            pedido: pedidoActualizado
        });
    } catch (error) {
        // 6. Devolver un mensaje de error si algo falló (status 500)
        console.error('💥 ERROR en entregarPedido:', error);
        res.status(500).json({ message: error.message });
    }
};

const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID del pedido es requerido" });
        }
        
        // 1. Obtener el pedido por id para verificar que existe
        const pedido = await PedidosService.getPedidoById(id);
        
        // 2. Si el pedido no existe, devolver un mensaje de error (status 404)
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        // 3. Eliminar el pedido
        const resultado = await PedidosService.deletePedido(id);
        
        // 4. Devolver un mensaje de éxito (status 200)
        res.status(200).json({ message: "Pedido eliminado exitosamente" });
    } catch (error) {
        // 5. Devolver un mensaje de error si algo falló (status 500)
        res.status(500).json({ message: error.message });
    }
};

export default {
    getPedidos,
    getPedidosByUser,
    getPedidoById,
    createPedido,
    aceptarPedido,
    comenzarPedido,
    entregarPedido,
    deletePedido,
};
