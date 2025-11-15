import { Plato } from "./platos.model.js";
import { Usuario } from "./usuarios.model.js";
import { Pedido, PlatoXPedido } from "./pedidos.model.js";

// Relaciones básicas
Usuario.hasMany(Pedido, { foreignKey: 'id_usuario', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Relación many-to-many entre Pedido y Plato a través de PlatoXPedido
Pedido.belongsToMany(Plato, { 
    through: PlatoXPedido, 
    foreignKey: 'id_pedido', 
    otherKey: 'id_plato',
    as: 'platos'
});

Plato.belongsToMany(Pedido, { 
    through: PlatoXPedido, 
    foreignKey: 'id_plato', 
    otherKey: 'id_pedido',
    as: 'pedidos'
});

export { Plato, Usuario, Pedido, PlatoXPedido };