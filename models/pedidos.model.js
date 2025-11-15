import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Pedido extends Model {}

Pedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "pendiente",
            validate: {
                isIn: [["pendiente", "aceptado", "en camino", "entregado"]],
            },
        },
    },
    {
        sequelize,
        modelName: "pedidos",
        timestamps: false,
    }
);

export class PlatoXPedido extends Model {}

PlatoXPedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_pedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'pedidos',
                key: 'id'
            }
        },
        id_plato: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'platos',
                key: 'id'
            }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        modelName: "platosxpedidos",
        timestamps: false,
    }
);