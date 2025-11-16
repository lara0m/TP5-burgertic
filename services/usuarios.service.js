import { Usuario } from "../models/index.js";
import bcryptjs from "bcryptjs";

const getUsuarioByEmail = async (email) => {
    try {
        const usuario = await Usuario.findOne({
            where: { email: email }
        });
        return usuario;
    } catch (error) {
        throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findByPk(id);
        return usuario;
    } catch (error) {
        throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
};

const getUserById = async (id) => {
    try {
        const usuario = await Usuario.findByPk(id);
        return usuario;
    } catch (error) {
        throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
};

const createUsuario = async (usuario) => {
    try {
        // Verificar si el email ya existe
        const existingUser = await getUsuarioByEmail(usuario.email);
        if (existingUser) {
            throw new Error("El email ya está registrado");
        }

        // Crear el usuario (el password se hasheará automáticamente por el hook)
        const nuevoUsuario = await Usuario.create({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: usuario.password,
            admin: false // Siempre false para nuevos registros
        });

        // Devolver usuario sin password
        const { password, ...usuarioSinPassword } = nuevoUsuario.toJSON();
        return usuarioSinPassword;
    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
};

const validatePassword = async (usuario, password) => {
    try {
        console.log('🔑 VALIDATE PASSWORD - Iniciando validación');
        console.log('📝 Password plano recibido:', password);
        console.log('🔒 Password hasheado en BD:', usuario.password);
        
        const isValid = await bcryptjs.compare(password, usuario.password);
        console.log('✅ Resultado de bcrypt.compare:', isValid);
        
        return isValid;
    } catch (error) {
        console.error('💥 Error en validatePassword:', error);
        throw new Error(`Error al validar password: ${error.message}`);
    }
};

export default { 
    getUsuarioByEmail, 
    getUsuarioById, 
    getUserById,
    createUsuario, 
    validatePassword 
};
