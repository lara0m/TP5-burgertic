import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(config => {
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (usuario) => {
  const res = await API.post('/auth/register', usuario);
  return res.data;
};

export const getPlatos = async () => {
  const res = await API.get('/platos');
  return res.data;
};

export const getPlatoById = async (id) => {
  try {
    console.log('🍔 Buscando plato con ID:', id);
    const res = await API.get(`/platos/${id}`);
    console.log('✅ Plato encontrado:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error al buscar plato:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Plato no encontrado');
    }
    throw new Error('Error al cargar los datos del plato');
  }
};

export const getPedidosUsuario = async () => {
  const res = await API.get('/pedidos/usuario');
  return res.data;
};

export const createPedido = async (platos) => {
  try {
    console.log('🛒 Creando pedido con platos:', platos);
    const token = localStorage.getItem('token');
    console.log('🔑 Token presente:', !!token);
    
    if (!token) {
      throw new Error('Debes iniciar sesión para hacer un pedido');
    }
    
    const res = await API.post('/pedidos', { platos });
    console.log('✅ Pedido creado exitosamente:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    console.error('📋 Detalles del error:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Datos del pedido inválidos');
    } else if (error.response?.status === 500) {
      throw new Error('Error interno del servidor. Inténtalo más tarde.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Error desconocido al crear el pedido');
  }
};

// Admin endpoints
export const getAllPedidos = async () => {
  const res = await API.get('/pedidos');
  return res.data;
};

export const getPedidoById = async (id) => {
  const res = await API.get(`/pedidos/${id}`);
  return res.data;
};

export const aceptarPedido = async (id) => {
  const res = await API.put(`/pedidos/${id}/aceptar`);
  return res.data;
};

export const comenzarPedido = async (id) => {
  const res = await API.put(`/pedidos/${id}/comenzar`);
  return res.data;
};

export const entregarPedido = async (id) => {
  const res = await API.put(`/pedidos/${id}/entregar`);
  return res.data;
};

export const deletePedido = async (id) => {
  const res = await API.delete(`/pedidos/${id}`);
  return res.data;
};

export const createPlato = async (plato) => {
  const res = await API.post('/platos', plato);
  return res.data;
};

export const updatePlato = async (id, plato) => {
  const res = await API.put(`/platos/${id}`, plato);
  return res.data;
};

export const deletePlato = async (id) => {
  const res = await API.delete(`/platos/${id}`);
  return res.data;
};

export default API;
