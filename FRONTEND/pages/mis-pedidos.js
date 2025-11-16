import { useEffect, useState } from 'react';
import { getPedidosUsuario } from '../services/api';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await getPedidosUsuario();
        setPedidos(data || []);
      } catch (err) {
        setError('Error al cargar pedidos: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#ff9800',
      aceptado: '#2196f3', 
      'en camino': '#9c27b0',
      entregado: '#4caf50'
    };
    return colores[estado] || '#757575';
  };

  if (loading) return <div className="loading">Cargando pedidos...</div>;
  
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <div className="card">
          <p>No tienes pedidos aún.</p>
          <p>¡Ve al <a href="/platos">menú</a> y haz tu primer pedido!</p>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="card pedido-card">
              <div className="pedido-header">
                <h3>Pedido #{pedido.id}</h3>
                <span 
                  className="estado-badge" 
                  style={{backgroundColor: getEstadoColor(pedido.estado)}}
                >
                  {pedido.estado.toUpperCase()}
                </span>
              </div>
              
              <div className="pedido-info">
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                
                {pedido.platos && pedido.platos.length > 0 && (
                  <div className="platos-pedido">
                    <h4>Platos:</h4>
                    <ul>
                      {pedido.platos.map((item, index) => (
                        <li key={index}>
                          <span>{item.cantidad}x {item.nombre}</span>
                          {item.precio && <span className="precio">${item.precio * item.cantidad}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {pedido.PlatoXPedidos && pedido.PlatoXPedidos.length > 0 && (
                  <div className="platos-pedido">
                    <h4>Platos:</h4>
                    <ul>
                      {pedido.PlatoXPedidos.map((item, index) => (
                        <li key={index}>
                          <span>{item.cantidad}x {item.Plato?.nombre || 'Plato'}</span>
                          {item.Plato?.precio && <span className="precio">${item.Plato.precio * item.cantidad}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}