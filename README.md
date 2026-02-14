# BurgerTIC - Como se hizo

**Tema elegido:** Route 66 American Diner  
**Tecnologías:** Node.js + Express + PostgreSQL + Next.js + JWT + Sequelize

---

## **Flujo de Tecnologías - Cuándo se usa cada librería**

### ** Backend - Flujo de Request**

#### **1. EXPRESS.JS** - Servidor y Manejo de Rutas
```javascript
// index.js - Servidor principal
const app = express();
app.use('/platos', PlatosRouter);  // Rutas de platos
app.use('/auth', AuthRouter);      // Rutas de autenticación
app.use('/pedidos', PedidosRouter); // Rutas de pedidos
app.listen(9000); // Servidor escuchando
```
**Se usa:** Para recibir requests HTTP, definir rutas y enviar responses

#### **2. CORS** - Comunicación Frontend-Backend
```javascript
app.use(cors()); // Permite requests desde localhost:3000
```
**Se usa:** Para permitir que el frontend (puerto 3000) se comunique con el backend (puerto 9000)

#### **3. SEQUELIZE** - Base de Datos y Modelos
```javascript
// models/usuarios.model.js - Definición del modelo
export class Usuario extends Model {}
Usuario.init({...}, { sequelize });

// services/usuarios.service.js - Operaciones de BD
const usuario = await Usuario.findOne({ where: { email } });
const nuevoUsuario = await Usuario.create({...});
```
**Se usa:** Para definir tablas, realizar queries, manejar relaciones entre modelos

#### **4. BCRYPTJS** - Hash de Contraseñas
```javascript
// models/usuarios.model.js - Hook beforeCreate
beforeCreate: async (usuario) => {
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(usuario.password, salt);
}

// services/usuarios.service.js - Validación
const isValid = await bcryptjs.compare(password, usuario.password);
```
**Se usa:** Para hashear passwords al registrar y validar passwords al login

#### **5. JSONWEBTOKEN (JWT)** - Autenticación
```javascript
// controllers/auth.controller.js - Crear token al login
const token = jwt.sign(
    { id: usuario.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30m' }
);

// middlewares/auth.middleware.js - Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
**Se usa:** Para crear tokens al login y verificar identidad en rutas protegidas

#### **6. DOTENV** - Variables de Entorno
```javascript
import 'dotenv/config';
// Carga variables de .env para usar process.env.JWT_SECRET, process.env.PGHOST
```
**Se usa:** Para cargar configuración sensible (credenciales DB, secrets) sin hardcodear

---

### ** Flujo Completo - Ejemplo: Usuario hace Login**

```
1. Frontend envía POST /auth/login
   ↓
2. EXPRESS recibe request en auth.router.js
   ↓  
3. CORS permite la comunicación cross-origin
   ↓
4. Controller valida email/password del body
   ↓
5. SEQUELIZE busca usuario en BD: Usuario.findOne()
   ↓
6. BCRYPTJS compara password: bcrypt.compare()
   ↓
7. JWT genera token: jwt.sign() con SECRET de DOTENV
   ↓
8. EXPRESS envía response con token y datos usuario
   ↓
9. Frontend guarda token para futuras requests
```

### ** Flujo de Request Protegida - Ejemplo: Crear Pedido**

```
1. Frontend envía POST /pedidos con header Authorization
   ↓
2. EXPRESS recibe request en pedidos.router.js
   ↓
3. MIDDLEWARE verifyToken extrae token del header
   ↓
4. JWT verifica token: jwt.verify() con SECRET de DOTENV
   ↓
5. SEQUELIZE busca usuario: Usuario.findByPk(decoded.id)
   ↓
6. MIDDLEWARE coloca usuario en req.usuario
   ↓
7. Controller valida datos del pedido
   ↓
8. SEQUELIZE crea pedido y relaciones: Pedido.create(), PlatoXPedido.bulkCreate()
   ↓
9. EXPRESS envía response con pedido creado
```

### ** Frontend - Flujo de Tecnologías**

#### **NEXT.JS** - Framework y Routing
```javascript
// pages/login.js - Página automática por ubicación
export default function Login() { ... }
// Routing automático: /login → pages/login.js
```

#### **REACT** - Componentes e Interactividad
```javascript
// Hooks para estado y efectos
const [user, setUser] = useState(null);
useEffect(() => { checkAuth(); }, []);
```

#### **AXIOS** - Comunicación con API
```javascript
// services/api.js - Configuración centralizada
const API = axios.create({ baseURL: 'http://localhost:9000' });
// Interceptor automático para agregar token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
});
```

---

### ** Resumen - Cuándo se usa cada librería:**

| **Librería** | **Cuándo se usa** | **Ejemplo concreto** |
|-------------|-------------------|---------------------|
| **Express** | Cada request HTTP | `app.post('/auth/login', ...)` |
| **CORS** | Cross-origin requests | Frontend 3000 → Backend 9000 |
| **Sequelize** | Operaciones de BD | `Usuario.findOne()`, `Pedido.create()` |
| **bcryptjs** | Passwords | Registro (hash) y Login (compare) |
| **JWT** | Autenticación | Login (crear) y rutas protegidas (verificar) |
| **dotenv** | Config sensible | DB credentials, JWT secret |
| **Next.js** | Routing y SSR | `/platos` → `pages/platos/index.js` |
| **React** | UI interactiva | `useState`, `useEffect`, componentes |
| **Axios** | HTTP requests | `API.post('/auth/login')` |

---

## **Instalación y Ejecución**

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

## **API REST Endpoints**

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

### **¿Cómo funciona el flujo de login Usuario Normal vs Admin?**

#### **Usuario Normal (cliente):**
1. **POST** `/auth/login` → Recibe token JWT + datos usuario
2. **Frontend** guarda en localStorage: `token`, `userRole: "user"`
3. **Navegación disponible:** Landing, platos, mis-pedidos
4. **Puede:** Ver platos, crear pedidos, ver sus propios pedidos
5. **NO puede:** Acceder a rutas `/admin/*`

#### **Usuario Admin:**
1. **POST** `/auth/login` → Recibe token JWT + datos usuario (`admin: true`)
2. **Frontend** detecta `usuario.admin === true` → guarda `userRole: "admin"`
3. **Header** muestra enlace "Setup" adicional
4. **Navegación disponible:** Todo lo de usuario + panel admin
5. **Puede:** CRUD platos, gestionar todos los pedidos, cambiar estados
6. **Acceso:** `/admin/setup`, `/admin-pedidos`

#### **Código clave:**
```javascript
// En login (frontend/pages/login.js)
if (data.usuario.admin) {
  localStorage.setItem('userRole', 'admin');
} else {
  localStorage.setItem('userRole', 'user');
}

// En Header (frontend/components/Header.js)
{user.admin && (
  <Link href="/admin/setup">Setup</Link>
)}

// En rutas admin (verificación)
const userRole = localStorage.getItem('userRole');
if (userRole !== 'admin') {
  router.push('/');
}
```
