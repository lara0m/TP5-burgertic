Route 66 Burgers - Frontend

Este frontend usa Next.js y consume la API del backend BurgerTIC.

Quick start:

1. Entrar al directorio frontend:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en desarrollo (puedes usar el backend corriendo en `http://localhost:9000`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:9000 npm run dev
```

Variables de entorno:
- `NEXT_PUBLIC_API_URL` (opcional) — URL base del backend. Si no se define, usa `http://localhost:9000`.

Páginas incluidas:
- `/` Landing
- `/login` Login
- `/register` Registro
- `/platos` Listado de platos
- `/platos/[id]` Detalle de plato
- `/admin/setup` Panel simple para CRUD de platos (requiere token de admin)

Notas:
- Este es un scaffold minimal para cumplir con la consigna. Puedes extender estilos, añadir assets o mejorar la UX.