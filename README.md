# BurgerTIC API

API REST para un sistema de pedidos de hamburguesas desarrollado con Node.js, Express, PostgreSQL y Sequelize.

## Características

- ✅ Autenticación JWT con roles (Usuario/Admin)
- ✅ CRUD completo de platos
- ✅ Sistema de pedidos con estados
- ✅ Middlewares de autenticación y autorización
- ✅ Validaciones de datos
- ✅ Manejo de errores robusto
- ✅ Relaciones de base de datos con Sequelize

## Tecnologías

- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **ORM**: Sequelize
- **Autenticación**: JWT, bcryptjs
- **Validación**: Middleware personalizado

## Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd TP5-burgertic
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiar `.env.example` a `.env` y configurar:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Neon:
```env
PGHOST=tu-host.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=tu_password_neon
JWT_SECRET=tu_clave_secreta_muy_segura
PORT=9000
```

### 4. Configurar base de datos Neon (PostgreSQL remoto)
1. Ve a [Neon](https://neon.tech/) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Copia las credenciales de conexión a tu archivo `.env`
4. ¡No necesitas instalar PostgreSQL localmente!

### 5. Poblar la base de datos
```bash
npm run seed
```

Este comando:
- Crea las tablas automáticamente
- Inserta 10 platos de ejemplo
- Crea 3 usuarios (1 admin + 2 usuarios regulares)
- Crea 2 pedidos de ejemplo

## Ejecutar la aplicación

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

La API estará disponible en: `http://localhost:9000`

## Usuarios de prueba

### Administrador
- **Email**: admin@burgertic.com
- **Password**: admin123

### Usuario regular
- **Email**: juan.perez@email.com
- **Password**: 123456

## Estructura de la API

### Autenticación
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|---------|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |

### Platos
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|---------|
| GET | `/platos` | Listar todos los platos | Público |
| GET | `/platos/:id` | Obtener plato por ID | Público |
| GET | `/platos/tipo/:tipo` | Platos por tipo | Público |
| POST | `/platos` | Crear plato | Admin |
| PUT | `/platos/:id` | Actualizar plato | Admin |
| DELETE | `/platos/:id` | Eliminar plato | Admin |

### Pedidos
| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|---------|
| GET | `/pedidos` | Listar todos los pedidos | Admin |
| GET | `/pedidos/usuario` | Pedidos del usuario autenticado | Usuario |
| GET | `/pedidos/:id` | Obtener pedido por ID | Admin |
| POST | `/pedidos` | Crear pedido | Usuario |
| PUT | `/pedidos/:id/aceptar` | Aceptar pedido | Admin |
| PUT | `/pedidos/:id/comenzar` | Comenzar pedido | Admin |
| PUT | `/pedidos/:id/entregar` | Entregar pedido | Admin |
| DELETE | `/pedidos/:id` | Eliminar pedido | Admin |

## Ejemplos de uso

### 1. Registro de usuario
```bash
curl -X POST http://localhost:9000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana",
    "apellido": "García", 
    "email": "ana@email.com",
    "password": "123456"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:9000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@burgertic.com",
    "password": "admin123"
  }'
```

### 3. Listar platos
```bash
curl http://localhost:9000/platos
```

### 4. Crear pedido (requiere token)
```bash
curl -X POST http://localhost:9000/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "platos": [
      {"id": 1, "cantidad": 2},
      {"id": 7, "cantidad": 1}
    ]
  }'
```

### 5. Ver pedidos del usuario
```bash
curl http://localhost:9000/pedidos/usuario \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Estados de pedidos

Los pedidos siguen este flujo de estados:
1. **pendiente** → 2. **aceptado** → 3. **en camino** → 4. **entregado**

## Validaciones implementadas

- **Email único**: No se permiten emails duplicados
- **Campos requeridos**: Validación de campos obligatorios
- **Estados válidos**: Solo transiciones permitidas entre estados
- **Autenticación**: Verificación de tokens JWT
- **Autorización**: Control de acceso por roles
- **Integridad referencial**: Foreign keys válidas

## Testing de la API

Se recomienda usar herramientas como:
- **Postman**: Para testing manual de endpoints
- **Thunder Client**: Extensión de VS Code
- **curl**: Para testing desde línea de comandos

### Collection de Postman
Se puede crear una collection con las siguientes requests configuradas con las URLs y headers apropiados.

## Solución de problemas

### Error de conexión a la base de datos
1. Verificar que PostgreSQL esté ejecutándose
2. Confirmar que las credenciales en `.env` sean correctas
3. Asegurarse de que la base de datos exista

### Error de token inválido
1. Verificar que el header Authorization tenga el formato: `Bearer <token>`
2. Confirmar que el token no haya expirado (duración: 30 minutos)
3. Asegurarse de usar el token correcto del login

### Error de permisos
1. Verificar que el usuario tenga los permisos necesarios
2. Para operaciones de admin, usar el usuario administrador