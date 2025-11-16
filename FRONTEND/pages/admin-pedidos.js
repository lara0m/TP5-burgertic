import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import { getAllPedidos, aceptarPedido, comenzarPedido, entregarPedido, deletePedido } from '../services/api';
import styles from '../styles/admin.module.css';

export default function AdminPedidos() {
  console.log('🔧 AdminPedidos - Componente iniciando...');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('🔧 AdminPedidos - useEffect iniciando...');
    const userRole = localStorage.getItem('userRole');
    console.log('👤 UserRole:', userRole);
    
    if (userRole !== 'admin') {
      console.log('❌ No es admin, redirigiendo...');
      router.push('/');
      return;
    }
    
    console.log('✅ Es admin, cargando pedidos...');
    fetchPedidos();
  }, [router]);

  const fetchPedidos = async () => {
    console.log('📋 Iniciando fetchPedidos...');
    try {
      const data = await getAllPedidos();
      console.log('✅ Pedidos obtenidos:', data);
      setPedidos(data);
    } catch (err) {
      console.error('💥 Error al obtener pedidos:', err);
      setError('Error al cargar los pedidos');
    } finally {
      console.log('🏁 fetchPedidos terminado');
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, action) => {
    try {
      let result;
      switch(action) {
        case 'aceptar':
          result = await aceptarPedido(id);
          break;
        case 'comenzar':
          result = await comenzarPedido(id);
          break;
        case 'entregar':
          result = await entregarPedido(id);
          break;
        default:
          return;
      }
      
      // Actualizar el pedido en el estado local
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === id ? { ...pedido, estado: result.estado } : pedido
        )
      );
    } catch (err) {
      console.error(`Error al ${action} pedido:`, err);
      setError(`Error al ${action} el pedido`);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pedido?')) return;
    
    try {
      await deletePedido(id);
      setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== id));
    } catch (err) {
      console.error('Error al eliminar pedido:', err);
      setError('Error al eliminar el pedido');
    }
  };

  const getStatusClass = (estado) => {
    switch(estado) {
      case 'pendiente': return 'badge-pendiente';
      case 'aceptado': return 'badge-aceptado';
      case 'en camino': return 'badge-camino';
      case 'entregado': return 'badge-entregado';
      default: return 'badge-default';
    }
  };

  const getNextAction = (estado) => {
    switch(estado) {
      case 'pendiente': return { action: 'aceptar', text: 'Aceptar', class: 'btn-aceptar' };
      case 'aceptado': return { action: 'comenzar', text: 'Comenzar', class: 'btn-comenzar' };
      case 'en camino': return { action: 'entregar', text: 'Entregar', class: 'btn-entregar' };
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (platos) => {
    if (!platos || platos.length === 0) return 0;
    
    return platos.reduce((total, plato) => {
      const precio = plato.precio || (plato.Plato && plato.Plato.precio) || 0;
      const cantidad = plato.cantidad || (plato.PlatoXPedido && plato.PlatoXPedido.cantidad) || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  if (loading) return <div className={styles.loading}>Cargando pedidos...</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin - Gestión de Pedidos | Route 66 Burgers</title>
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        <div className={styles.adminHeader}>
          <h1 className={styles.title}>🍔 Panel de Gestión de Pedidos</h1>
          <p className={styles.subtitle}>Administra todos los pedidos del restaurante</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.pedidosGrid}>
          {pedidos.length === 0 ? (
            <div className={styles.noPedidos}>
              <p>📋 No hay pedidos en el sistema</p>
            </div>
          ) : (
            pedidos.map(pedido => (
              <div key={pedido.id} className={styles.pedidoCard}>
                <div className={styles.pedidoHeader}>
                  <div className={styles.pedidoInfo}>
                    <h3>Pedido #{pedido.id}</h3>
                    <p className={styles.usuario}>
                      👤 {pedido.Usuario ? pedido.Usuario.nombre : 'Usuario desconocido'}
                    </p>
                    <p className={styles.fecha}>
                      📅 {formatDate(pedido.fecha)}
                    </p>
                  </div>
                  <div className={styles.estadoSection}>
                    <span className={`${styles.estadoBadge} ${styles[getStatusClass(pedido.estado)]}`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>

                <div className={styles.platosSection}>
                  <h4>Platos del pedido:</h4>
                  <ul className={styles.platosList}>
                    {pedido.platos && pedido.platos.length > 0 ? (
                      pedido.platos.map((plato, index) => (
                        <li key={index} className={styles.platoItem}>
                          <span className={styles.platoNombre}>
                            {plato.nombre || (plato.Plato && plato.Plato.nombre)}
                          </span>
                          <span className={styles.platoCantidad}>
                            x{plato.cantidad || (plato.PlatoXPedido && plato.PlatoXPedido.cantidad) || 1}
                          </span>
                          <span className={styles.platoPrecio}>
                            ${(plato.precio || (plato.Plato && plato.Plato.precio) || 0).toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No hay platos en este pedido</li>
                    )}
                  </ul>
                  
                  <div className={styles.total}>
                    <strong>Total: ${calculateTotal(pedido.platos).toFixed(2)}</strong>
                  </div>
                </div>

                <div className={styles.actionsSection}>
                  {getNextAction(pedido.estado) && (
                    <button
                      onClick={() => handleEstadoChange(pedido.id, getNextAction(pedido.estado).action)}
                      className={`${styles.actionBtn} ${styles[getNextAction(pedido.estado).class]}`}
                    >
                      {getNextAction(pedido.estado).text}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEliminar(pedido.id)}
                    className={`${styles.actionBtn} ${styles.btnEliminar}`}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <style jsx global>{`
        .${styles.badge_pendiente} {
          background-color: #fbbf24;
          color: #92400e;
        }
        
        .${styles.badge_aceptado} {
          background-color: #60a5fa;
          color: #1e40af;
        }
        
        .${styles.badge_preparacion} {
          background-color: #f472b6;
          color: #be185d;
        }
        
        .${styles.badge_listo} {
          background-color: #34d399;
          color: #065f46;
        }
        
        .${styles.badge_default} {
          background-color: #9ca3af;
          color: #374151;
        }
      `}</style>
    </div>
  );
}