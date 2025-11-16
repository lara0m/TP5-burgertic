import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { getPlatoById, createPedido } from '../../services/api';

export default function PlatoDetail(){
  const router = useRouter();
  const { id } = router.query;
  const [plato, setPlato] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(()=>{
    if (!id) return;
    
    const fetchPlato = async () => {
      try {
        setLoadingData(true);
        console.log('Buscando plato con ID:', id);
        const p = await getPlatoById(id);
        console.log('Plato recibido:', p);
        setPlato(p);
      } catch (error) {
        console.error('Error al cargar plato:', error);
        setMsg('❌ Error al cargar los detalles del plato');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchPlato();
  },[id]);

  const handleAddToOrder = async ()=>{
    setLoading(true);
    setMsg(''); // Limpiar mensaje previo
    
    try{
      console.log('Creando pedido con:', {
        platoId: Number(id),
        cantidad: Number(cantidad),
        plato: plato
      });
      
      // Verificar que tenemos los datos necesarios
      if (!plato) {
        throw new Error('No se han cargado los datos del plato');
      }
      
      if (!localStorage.getItem('token')) {
        throw new Error('Debes iniciar sesión para hacer un pedido');
      }
      
      // Crear pedido con este plato
      const pedido = await createPedido([{ id: Number(id), cantidad: Number(cantidad) }]);
      console.log('Pedido creado:', pedido);
      
      setMsg(`🎉 ¡Pedido realizado exitosamente! 
      📋 Número de pedido: ${pedido.id}
      🍔 ${cantidad}x ${plato?.nombre || 'Producto'}
      💰 Total: $${(Number(plato?.precio || 0) * Number(cantidad)).toFixed(2)}`);
      
      setTimeout(() => {
        router.push('/mis-pedidos');
      }, 3000);
    } catch(err){
      console.error('Error en pedido:', err);
      setMsg(`❌ Error: ${err.message || 'No se pudo realizar el pedido'}`);
    } finally {
      setLoading(false);
    }
  };

  const getPlatoIcon = (tipo) => {
    switch(tipo) {
      case 'principal': return '🍔';
      case 'entrada': return '🍟';
      case 'postre': return '🍰';
      case 'bebida': return '🥤';
      default: return '🍽️';
    }
  };

  if (!plato || loadingData) return (
    <div>
      <Head>
        <title>Cargando... - Route 66 Burgers</title>
      </Head>
      <Header />
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ 
          background: 'linear-gradient(45deg, #ffd700, #ffeb3b)',
          padding: '20px',
          borderRadius: '15px',
          display: 'inline-block',
          color: '#1a1a1a',
          fontSize: '1.2em',
          fontWeight: 'bold'
        }}>
          🍔 Cargando deliciosos detalles...
        </div>
        {msg && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            marginTop: '20px',
            display: 'inline-block'
          }}>
            {msg}
          </div>
        )}
      </main>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
      <Head>
        <title>{plato?.nombre || 'Plato'} - Route 66 Burgers</title>
      </Head>
      <Header />
      
      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: '25px',
          padding: '40px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header del plato */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              fontSize: '6em',
              marginBottom: '20px',
              filter: 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5))'
            }}>
              {getPlatoIcon(plato?.tipo || 'principal')}
            </div>
            
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(45deg, #ffd700, #ffeb3b)',
              color: '#1a1a1a',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '0.9em',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '15px'
            }}>
              {plato?.tipo || 'Principal'}
            </div>
            
            <h1 style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: '3em',
              color: '#ffd700',
              textShadow: '3px 3px 0px #8b0000, 6px 6px 10px rgba(0, 0, 0, 0.8)',
              marginBottom: '10px',
              letterSpacing: '2px'
            }}>
              {(plato?.nombre || 'Plato Delicioso').toUpperCase()}
            </h1>
            
            <p style={{
              fontSize: '1.3em',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {plato.descripcion || 'Deliciosa especialidad de la casa preparada con ingredientes frescos y de la más alta calidad.'}
            </p>
          </div>

          {/* Precio destacado */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(45deg, #d32f2f, #ff4444)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '25px',
              border: '3px solid #ff4444',
              boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)'
            }}>
              <span style={{
                fontSize: '0.9em',
                display: 'block',
                marginBottom: '5px',
                opacity: '0.9'
              }}>
                Precio por unidad
              </span>
              <span style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: '3em',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                ${Number(plato?.precio || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Selector de cantidad */}
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              color: '#ffd700',
              marginBottom: '20px',
              fontSize: '1.4em',
              textAlign: 'center',
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '1px'
            }}>
              🛒 CANTIDAD
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}>
              <button 
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                style={{
                  background: 'linear-gradient(45deg, #d32f2f, #ff4444)',
                  border: 'none',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '25px',
                  fontSize: '1.5em',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                -
              </button>
              
              <input 
                type="number" 
                value={cantidad} 
                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                min={1}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '3px solid #ffd700',
                  borderRadius: '15px',
                  padding: '15px',
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100px',
                  color: '#1a1a1a'
                }}
              />
              
              <button 
                onClick={() => setCantidad(cantidad + 1)}
                style={{
                  background: 'linear-gradient(45deg, #ffd700, #ffeb3b)',
                  border: 'none',
                  color: '#1a1a1a',
                  width: '50px',
                  height: '50px',
                  borderRadius: '25px',
                  fontSize: '1.5em',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                +
              </button>
            </div>
            
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '1.3em',
              color: '#ffd700',
              fontWeight: 'bold'
            }}>
              💰 Total: ${(Number(plato?.precio || 0) * Number(cantidad)).toFixed(2)}
            </div>
          </div>

          {/* Botón de pedido */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button 
              onClick={handleAddToOrder}
              disabled={loading}
              style={{
                background: loading ? 'rgba(128, 128, 128, 0.5)' : 'linear-gradient(45deg, #ffd700 0%, #ffeb3b 50%, #fff59d 100%)',
                color: '#1a1a1a',
                border: '3px solid #ffd700',
                padding: '20px 50px',
                borderRadius: '30px',
                fontSize: '1.4em',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s ease',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontFamily: 'Impact, Arial Black, sans-serif',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                margin: '0 auto'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                }
              }}
            >
              {loading ? (
                <>
                  ⏳ Procesando...
                </>
              ) : (
                <>
                  🍔 Realizar Pedido
                </>
              )}
            </button>
          </div>

          {/* Mensaje de estado */}
          {msg && (
            <div style={{
              background: msg.includes('Error') || msg.includes('❌') ? 
                'linear-gradient(45deg, #ff4444, #d32f2f)' : 
                'linear-gradient(45deg, #4caf50, #2e7d32)',
              color: 'white',
              padding: '20px',
              borderRadius: '15px',
              marginTop: '20px',
              whiteSpace: 'pre-line',
              fontSize: '1.1em',
              lineHeight: '1.6',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}>
              {msg}
              {msg.includes('🎉') && (
                <div style={{ marginTop: '15px', fontSize: '0.9em', opacity: '0.9' }}>
                  Serás redirigido a "Mis Pedidos" en unos segundos...
                </div>
              )}
            </div>
          )}

          {/* Botón volver */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => router.back()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1em',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              ← Volver al Menú
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
