# Ejemplos de Requests para Testing

## 1. Autenticación

### Registro de usuario
```bash
POST http://localhost:9000/auth/register
Content-Type: application/json

{
  "nombre": "Test",
  "apellido": "Usuario",
  "email": "test@email.com",
  "password": "123456"
}
```

### Login Admin
```bash
POST http://localhost:9000/auth/login
Content-Type: application/json

{
  "email": "admin@burgertic.com",
  "password": "admin123"
}
```

### Login Usuario
```bash
POST http://localhost:9000/auth/login
Content-Type: application/json

{
  "email": "juan.perez@email.com",
  "password": "123456"
}
```

## 2. Platos (Públicos)

### Listar todos los platos
```bash
GET http://localhost:9000/platos
```

### Obtener plato por ID
```bash
GET http://localhost:9000/platos/1
```

### Platos por tipo
```bash
GET http://localhost:9000/platos/tipo/principal
GET http://localhost:9000/platos/tipo/combo
GET http://localhost:9000/platos/tipo/postre
```

### Crear plato (ADMIN)
```bash
POST http://localhost:9000/platos
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "tipo": "principal",
  "nombre": "Nueva Hamburguesa",
  "precio": 400,
  "descripcion": "Descripción de la nueva hamburguesa"
}
```

### Actualizar plato (ADMIN)
```bash
PUT http://localhost:9000/platos/1
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "tipo": "principal",
  "nombre": "Hamburguesa Actualizada",
  "precio": 350,
  "descripcion": "Nueva descripción"
}
```

### Eliminar plato (ADMIN)
```bash
DELETE http://localhost:9000/platos/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## 3. Pedidos

### Crear pedido (USUARIO)
```bash
POST http://localhost:9000/pedidos
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

{
  "platos": [
    {"id": 1, "cantidad": 2},
    {"id": 7, "cantidad": 1}
  ]
}
```

### Ver mis pedidos (USUARIO)
```bash
GET http://localhost:9000/pedidos/usuario
Authorization: Bearer YOUR_USER_TOKEN
```

### Listar todos los pedidos (ADMIN)
```bash
GET http://localhost:9000/pedidos
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Ver pedido por ID (ADMIN)
```bash
GET http://localhost:9000/pedidos/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Aceptar pedido (ADMIN)
```bash
PUT http://localhost:9000/pedidos/1/aceptar
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Comenzar pedido (ADMIN)
```bash
PUT http://localhost:9000/pedidos/1/comenzar
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Entregar pedido (ADMIN)
```bash
PUT http://localhost:9000/pedidos/1/entregar
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Eliminar pedido (ADMIN)
```bash
DELETE http://localhost:9000/pedidos/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## 4. Flujo completo de prueba

### Paso 1: Login como admin
```bash
POST http://localhost:9000/auth/login
{
  "email": "admin@burgertic.com",
  "password": "admin123"
}
# Guarda el token recibido
```

### Paso 2: Login como usuario
```bash
POST http://localhost:9000/auth/login
{
  "email": "juan.perez@email.com", 
  "password": "123456"
}
# Guarda el token recibido
```

### Paso 3: Ver platos disponibles
```bash
GET http://localhost:9000/platos
```

### Paso 4: Crear pedido como usuario
```bash
POST http://localhost:9000/pedidos
Authorization: Bearer USER_TOKEN
{
  "platos": [
    {"id": 1, "cantidad": 1},
    {"id": 4, "cantidad": 1}
  ]
}
```

### Paso 5: Ver todos los pedidos como admin
```bash
GET http://localhost:9000/pedidos
Authorization: Bearer ADMIN_TOKEN
```

### Paso 6: Cambiar estado del pedido como admin
```bash
PUT http://localhost:9000/pedidos/{ID}/aceptar
Authorization: Bearer ADMIN_TOKEN

PUT http://localhost:9000/pedidos/{ID}/comenzar
Authorization: Bearer ADMIN_TOKEN

PUT http://localhost:9000/pedidos/{ID}/entregar
Authorization: Bearer ADMIN_TOKEN
```

## Notas importantes:

1. **Reemplazar tokens**: Cambiar `YOUR_ADMIN_TOKEN` y `YOUR_USER_TOKEN` por los tokens reales obtenidos del login
2. **IDs dinámicos**: Los IDs de platos y pedidos pueden variar, verificar con GET requests
3. **Estados**: Los pedidos solo pueden cambiar estado en orden: pendiente → aceptado → en camino → entregado
4. **Autorización**: Verificar que estás usando el token correcto según el tipo de operación
5. **Expiración**: Los tokens expiran en 30 minutos, hacer login nuevamente si es necesario