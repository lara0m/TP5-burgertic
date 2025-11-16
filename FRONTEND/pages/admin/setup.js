import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { getPlatos, createPlato, deletePlato } from '../../services/api';
import styles from '../../styles/admin.module.css';

export default function AdminSetup(){
  const [platos, setPlatos] = useState([]);
  const [form, setForm] = useState({tipo:'principal', nombre:'', precio:'', descripcion:''});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchPlatos();
  }, [router]);

  const fetchPlatos = async () => {
    try {
      const data = await getPlatos();
      setPlatos(data || []);
    } catch (err) {
      console.error('Error al obtener platos:', err);
      setMsg('Error al cargar los platos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e)=>{
    e.preventDefault();
    
    if (!form.nombre || !form.precio) {
      setMsg('Nombre y precio son obligatorios');
      return;
    }

    try{
      await createPlato(form);
      setMsg('Plato creado exitosamente');
      setForm({tipo:'principal', nombre:'', precio:'', descripcion:''});
      await fetchPlatos();
      setTimeout(() => setMsg(''), 3000);
    } catch(err){
      console.error('Error al crear plato:', err);
      setMsg('Error al crear el plato');
    }
  };

  const handleDelete = async (id)=>{
    if(!confirm('¿Estás seguro de que quieres eliminar este plato?')) return;
    try{
      await deletePlato(id);
      setPlatos(platos.filter(p=>p.id!==id));
      setMsg('Plato eliminado exitosamente');
      setTimeout(() => setMsg(''), 3000);
    } catch(err){
      console.error('Error al eliminar plato:', err);
      setMsg('Error al eliminar el plato');
    }
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin - Gestión de Platos | Route 66 Burgers</title>
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        <div className={styles.adminHeader}>
          <h1 className={styles.title}>🍔 Panel de Administración</h1>
          <p className={styles.subtitle}>Gestiona el menú de Route 66 Burgers</p>
        </div>

        <div className={styles.adminNav}>
          <Link href="/admin-pedidos" className={styles.navBtn}>
            📋 Gestionar Pedidos
          </Link>
          <Link href="/admin/setup" className={styles.navBtn}>
            🍕 Gestionar Platos
          </Link>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Crear Nuevo Plato</h2>
          <form onSubmit={handleCreate}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo de Plato</label>
                <select 
                  className={styles.formSelect}
                  value={form.tipo} 
                  onChange={(e)=>setForm({...form, tipo:e.target.value})}
                >
                  <option value="principal">Principal</option>
                  <option value="combo">Combo</option>
                  <option value="postre">Postre</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre del Plato</label>
                <input 
                  className={styles.formInput}
                  type="text"
                  placeholder="Ej: Big Route Burger"
                  value={form.nombre} 
                  onChange={(e)=>setForm({...form, nombre:e.target.value})}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Precio ($)</label>
                <input 
                  className={styles.formInput}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15.99"
                  value={form.precio} 
                  onChange={(e)=>setForm({...form, precio:e.target.value})}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Descripción</label>
                <textarea 
                  className={styles.formTextarea}
                  placeholder="Describe los ingredientes y características del plato..."
                  value={form.descripcion} 
                  onChange={(e)=>setForm({...form, descripcion:e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <button className={styles.submitBtn} type="submit">
              ✨ Crear Plato
            </button>
          </form>
        </div>

        {msg && (
          <div className={msg.includes('Error') ? styles.error : styles.success}>
            {msg}
          </div>
        )}

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Platos en el Menú ({platos.length})</h2>
          
          {platos.length === 0 ? (
            <div className={styles.noPedidos}>
              <p>🍽️ No hay platos en el menú aún</p>
            </div>
          ) : (
            <div className={styles.platosGrid}>
              {platos.map(plato => (
                <div key={plato.id} className={styles.platoCard}>
                  <div className={styles.platoContent}>
                    <div className={styles.platoName}>{plato.nombre}</div>
                    
                    <div className={styles.platoDescription}>
                      {plato.descripcion || 'Sin descripción'}
                    </div>
                    
                    <div className={styles.platoFooter}>
                      <div className={styles.platoPrice}>${plato.precio}</div>
                      <div className={styles.platoType}>{plato.tipo}</div>
                    </div>
                    
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(plato.id)}
                    >
                      🗑️ Eliminar Plato
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #155724;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
