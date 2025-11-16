import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    console.log('🔐 AUTH MIDDLEWARE - verifyToken iniciado');
    console.log('📋 Headers recibidos:', req.headers);
    
    try {
        // 1. Verificar si hay un token en los headers de autorización
        const authHeader = req.headers['authorization'];
        console.log('🔑 Auth header:', authHeader);
        
        if (!authHeader) {
            console.log('❌ No hay auth header');
            return res.status(401).json({ message: "Token de acceso requerido" });
        }

        // 2. Verificar que el token esté en el formato correcto (Bearer <token>)
        const token = authHeader.split(' ')[1];
        console.log('🎫 Token extraído:', token ? 'PRESENTE' : 'AUSENTE');
        
        if (!token) {
            console.log('❌ Formato de token inválido');
            return res.status(401).json({ message: "Formato de token inválido" });
        }

        // 3. Verificar que el token sea válido
        console.log('🔍 Verificando token con JWT...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decodificado:', decoded);
        
        // 4. Verificar que tenga un id de usuario al decodificarlo
        if (!decoded.id) {
            console.log('❌ No hay ID en token decodificado');
            return res.status(401).json({ message: "Token inválido: ID de usuario no encontrado" });
        }

        // Verificar que el usuario existe
        console.log(`🔍 Buscando usuario con ID: ${decoded.id}`);
        const usuario = await UsuariosService.getUserById(decoded.id);
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado en BD');
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        console.log('✅ Usuario encontrado:', { id: usuario.id, email: usuario.email, admin: usuario.admin });
        req.usuario = usuario;
        console.log('✅ Auth middleware completado exitosamente');
        next();
    } catch (error) {
        console.error('💥 ERROR en auth middleware:', error);
        if (error.name === 'TokenExpiredError') {
            console.log('❌ Token expirado');
            return res.status(401).json({ message: "Token expirado" });
        }
        console.log('❌ Token inválido');
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
