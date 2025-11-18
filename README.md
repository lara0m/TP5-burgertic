# BurgerTIC - Como se hizo

**Tema elegido:** Route 66 American Diner  
**Tecnologías:** Node.js + Express + PostgreSQL + Next.js + JWT + Sequelize

---

## **Instalación y Ejecución**

### **Prerequisitos**
```bash
Node.js (v18 o superior)
npm o yarn
Cuenta en Neon Database (PostgreSQL)
```

### **1. Clonar y configurar Backend**
```bash
cd TP5-burgertic
npm install
```

### **2. Configurar variables de entorno**
Crear archivo `.env` en la raíz:
```env
# Database (Neon PostgreSQL)
PGHOST=tu-host-neon.aws.neon.tech
PGDATABASE=tu-database
PGUSER=tu-usuario
PGPASSWORD=tu-password

# JWT
JWT_SECRET=tu-jwt-secret-muy-seguro

# Server
PORT=9000
```

### **3. Iniciar Backend**
```bash
npm start
# Servidor corriendo en http://localhost:9000
```

### **4. Configurar Frontend**
```bash
cd FRONTEND
npm install
npm run dev
# Frontend corriendo en http://localhost:3000
```

---

## **Arquitectura del Proyecto**

### **Backend (Node.js + Express)**
```
├── controllers/     # Lógica de endpoints
├── services/        # Lógica de negocio
├── models/          # Modelos Sequelize
├── middlewares/     # Auth y validaciones
├── routes/          # Definición de rutas
├── db.js           # Configuración de base de datos
└── index.js        # Punto de entrada
```

### **Frontend (Next.js)**
```
├── pages/          # Rutas y páginas
├── components/     # Componentes reutilizables
├── services/       # APIs y servicios
└── styles/         # CSS modules
```

---

## **Base de Datos (Sequelize + PostgreSQL)**

### **Tablas implementadas:**

**usuarios**
- `id` (PK, auto-increment)
- `nombre`, `apellido`, `email`, `password`, `admin`

**platos** 
- `id` (PK, auto-increment)
- `tipo` ("principal", "combo", "postre")
- `nombre`, `precio`, `descripcion`

**pedidos**
- `id` (PK, auto-increment) 
- `id_usuario` (FK → usuarios)
- `fecha`, `estado` ("pendiente", "aceptado", "en camino", "entregado")

**platosxpedidos** (tabla intermedia)
- `id` (PK), `id_pedido` (FK), `id_plato` (FK), `cantidad`

### **Relaciones Sequelize:**
```javascript
// One-to-Many
Usuario.hasMany(Pedido, { foreignKey: 'id_usuario', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Many-to-Many através de tabla intermedia
Pedido.belongsToMany(Plato, { through: PlatoXPedido, foreignKey: 'id_pedido', as: 'platos' });
```

---

## **Autenticación y Autorización**

### **JWT Token**
- **Duración:** 30 minutos
- **Payload:** `{ id: usuario_id }`
- **Header:** `Authorization: Bearer <token>`

### **Middleware de Autenticación**
```javascript
export const verifyToken = async (req, res, next) => {
    // Verifica token JWT y coloca usuario en req.usuario
}

export const verifyAdmin = async (req, res, next) => {
    // Verifica que req.usuario.admin === true
}
```

### **Hash de Contraseñas (bcryptjs)**
```javascript
// En modelo Usuario - hook beforeCreate
beforeCreate: async (usuario) => {
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(usuario.password, salt);
}
```

---

## 📡 **API REST Endpoints**

### **Autenticación (Público)**
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login y generación de JWT

### **Platos (Público para GET, Admin para CUD)**
- `GET /platos` - Listar todos los platos
- `GET /platos/:id` - Obtener plato por ID
- `GET /platos/tipo/:tipo` - Filtrar platos por tipo
- `POST /platos` **Admin** - Crear plato
- `PUT /platos/:id` **Admin** - Actualizar plato
- `DELETE /platos/:id` **Admin** - Eliminar plato

### **Pedidos (Autenticado/Admin)**
- `GET /pedidos` **Admin** - Todos los pedidos
- `GET /pedidos/usuario` **Usuario** - Mis pedidos
- `POST /pedidos` **Usuario** - Crear pedido
- `PUT /pedidos/:id/aceptar` **Admin** - Aceptar pedido
- `PUT /pedidos/:id/comenzar` **Admin** - Comenzar pedido
- `PUT /pedidos/:id/entregar` **Admin** - Entregar pedido
- `DELETE /pedidos/:id` **Admin** - Eliminar pedido

---

## **Frontend - Funcionalidades**

### **Páginas Públicas**
- `/` - Landing page (Route 66 theme)
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/platos` - Catálogo de hamburguesas
- `/platos/[id]` - Detalle de plato

### **Páginas de Cliente Autenticado**
- `/mis-pedidos` - Ver mis pedidos con estados

### **Páginas de Admin**
- `/admin/setup` - CRUD de platos
- `/admin-pedidos` - Gestión de todos los pedidos

---

## **Testing y Usuarios de Prueba**

### **Usuario Admin**
```
Email: admin@burgertic.com
Password: admin123
```

### **Usuario Cliente** (crear via registro)
```
Cualquier email válido
Password: mínimo 6 caracteres
```

### **Datos de prueba incluidos:**
- 10+ platos de diferentes tipos
- Usuarios de prueba
- Pedidos de ejemplo

---

## **Preguntas de Defensa - Respuestas Clave**

### **¿Cómo funciona la conexión Frontend-Backend?**
- Frontend (Next.js puerto 3000) → API calls → Backend (Express puerto 9000)
- Servicio `api.js` centraliza todas las llamadas HTTP con Axios
- JWT token enviado en header Authorization para rutas protegidas

### **¿Cómo se aplican las Foreign Keys en Sequelize?**
```javascript
// Definición en modelo
id_usuario: {
    type: DataTypes.INTEGER,
    references: { model: 'usuarios', key: 'id' }
}

// Asociaciones
Usuario.hasMany(Pedido, { foreignKey: 'id_usuario' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
```

### **¿Qué ventajas presenta Sequelize?**
- **Validación automática:** Tipos de datos, required, unique
- **Parseo bidireccional:** JS Objects ↔ SQL
- **Hooks:** beforeCreate para hash de passwords
- **Asociaciones:** Include automático en queries
- **Migraciones:** Sync de modelos con BD

### **¿Cómo se probaron los endpoints?**
- Postman para testing manual de APIs
- Logs detallados en consola
- Frontend integrado como prueba end-to-end
- Testing de todos los flujos: registro → login → pedidos

### **¿Dónde está la función que valida X condición?**
- **Autenticación:** `middlewares/auth.middleware.js`
- **Validación de pedidos:** `controllers/pedidos.controller.js` + `services/pedidos.service.js`
- **Hash passwords:** `models/usuarios.model.js` (hook beforeCreate)
- **Validación admin:** `middleware verifyAdmin()`