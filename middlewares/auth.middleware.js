import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    try {
        // 1. Verificar si hay un token en los headers de autorización
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "Token de acceso requerido" });
        }

        // 2. Verificar que el token esté en el formato correcto (Bearer <token>)
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Formato de token inválido" });
        }

        // 3. Verificar que el token sea válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Verificar que tenga un id de usuario al decodificarlo
        if (!decoded.id) {
            return res.status(401).json({ message: "Token inválido: ID de usuario no encontrado" });
        }

        // Verificar que el usuario existe
        const usuario = await UsuariosService.getUserById(decoded.id);
        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado" });
        }
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        // 1. Verificar que el usuario está autenticado
        if (!req.usuario) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        // 2. Verificar que el usuario es administrador
        if (!req.usuario.admin) {
            return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
