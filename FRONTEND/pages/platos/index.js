import Link from 'next/link';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import { getPlatos } from '../../services/api';
import styles from '../../styles/platos.module.css';

export default function Platos(){
  const [platos, setPlatos] = useState([]);
  const [filteredPlatos, setFilteredPlatos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlatos();
  }, []);

  useEffect(() => {
    filterPlatos();
  }, [platos, selectedFilter]);

  const fetchPlatos = async () => {
    try {
      const data = await getPlatos();
      setPlatos(data || []);
    } catch (err) {
      console.error('Error al obtener platos:', err);
      setError('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const filterPlatos = () => {
    if (selectedFilter === 'todos') {
      setFilteredPlatos(platos);
    } else {
      setFilteredPlatos(platos.filter(plato => plato.tipo === selectedFilter));
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const getFilterIcon = (filter) => {
    switch(filter) {
      case 'todos': return '🍽️';
      case 'principal': return '🍔';
      case 'combo': return '🍟';
      case 'postre': return '🍰';
      default: return '🍽️';
    }
  };

  const getFilterLabel = (filter) => {
    switch(filter) {
      case 'todos': return 'Todos';
      case 'principal': return 'Principales';
      case 'combo': return 'Combos';
      case 'postre': return 'Postres';
      default: return filter;
    }
  };

  const getPlatoIcon = (tipo) => {
    switch(tipo) {
      case 'principal': return '🍔';
      case 'combo': return '🍟';
      case 'postre': return '🍰';
      default: return '🍽️';
    }
  };

  const filters = ['todos', 'principal', 'combo', 'postre'];

  if (loading) return <div className={styles.loading}>Cargando menú...</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Menú | Route 66 Burgers</title>
        <meta name="description" content="Descubre nuestro delicioso menú de hamburguesas americanas" />
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>🍔 Nuestro Menú</h1>
          <p className={styles.subtitle}>¡Las mejores hamburguesas de la Route 66!</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.filtersSection}>
          <h2 className={styles.filtersTitle}>🎯 Filtrar por Categoría</h2>
          <div className={styles.filtersGrid}>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`${styles.filterBtn} ${selectedFilter === filter ? styles.active : ''}`}
              >
                <span className={styles.icon}>{getFilterIcon(filter)}</span>
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.resultCount}>
          {filteredPlatos.length} plato{filteredPlatos.length !== 1 ? 's' : ''} 
          {selectedFilter !== 'todos' ? ` en ${getFilterLabel(selectedFilter)}` : ' en total'}
        </div>

        {filteredPlatos.length === 0 ? (
          <div className={styles.noPlatos}>
            <p>🔍 No hay platos disponibles en esta categoría</p>
          </div>
        ) : (
          <div className={styles.platosGrid}>
            {filteredPlatos.map(plato => (
              <div key={plato.id} className={styles.platoCard}>
                <div className={styles.platoImage}>
                  {getPlatoIcon(plato.tipo)}
                </div>
                
                <div className={styles.platoContent}>
                  <div className={styles.platoType}>
                    {plato.tipo}
                  </div>
                  
                  <h3 className={styles.platoName}>{plato.nombre}</h3>
                  
                  <p className={styles.platoDescription}>
                    {plato.descripcion || 'Delicioso plato preparado con los mejores ingredientes'}
                  </p>
                  
                  <div className={styles.platoFooter}>
                    <div className={styles.platoPrice}>
                      ${Number(plato.precio).toFixed(2)}
                    </div>
                    <Link href={`/platos/${plato.id}`} className={styles.verBtn}>
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
