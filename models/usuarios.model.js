import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";
import bcryptjs from "bcryptjs";

export class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "usuarios",
        timestamps: false,
        hooks: {
            beforeCreate: async (usuario) => {
                const salt = await bcryptjs.genSalt(10);
                usuario.password = await bcryptjs.hash(usuario.password, salt);
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed('password')) {
                    const salt = await bcryptjs.genSalt(10);
                    usuario.password = await bcryptjs.hash(usuario.password, salt);
                }
            },
        },
    }
);

// Método para verificar password
Usuario.prototype.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
};