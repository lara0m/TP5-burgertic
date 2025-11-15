import UsuariosService from "../services/usuarios.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        // 1. Verificar que el body de la request tenga los datos necesarios
        const { nombre, apellido, email, password } = req.body;

        // 2. Verificar que todos los campos requeridos estén presentes
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ 
                message: "Todos los campos son requeridos: nombre, apellido, email, password" 
            });
        }

        // 3. Verificar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Formato de email inválido" });
        }

        // 4. Verificar longitud mínima de password
        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // 5. Crear el usuario (el servicio verifica si el email ya existe)
        const nuevoUsuario = await UsuariosService.createUsuario({
            nombre,
            apellido,
            email,
            password
        });

        // 6. Devolver mensaje de éxito
        res.status(201).json({ 
            message: "Usuario registrado exitosamente",
            usuario: nuevoUsuario
        });

    } catch (error) {
        if (error.message.includes("email ya está registrado")) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
    }
};

const login = async (req, res) => {
    try {
        // 1. Verificar que el body tenga email y password
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email y contraseña son requeridos" 
            });
        }

        // 2. Buscar usuario por email
        const usuario = await UsuariosService.getUsuarioByEmail(email);

        // 3. Verificar que el usuario exista
        if (!usuario) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        // 4. Verificar que la contraseña sea correcta
        const isPasswordValid = await UsuariosService.validatePassword(usuario, password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        // 5. Crear token JWT con duración de 30 minutos
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        // 6. Devolver usuario (sin password) y token
        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.status(200).json({
            message: "Login exitoso",
            usuario: usuarioSinPassword,
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
    }
};

export default { register, login };
