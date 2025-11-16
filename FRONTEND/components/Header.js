import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Header(){
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (userName) {
      setUser({ name: userName, admin: userRole === 'admin' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setUser(null);
    router.push('/');
  };

  return (
    <div>
      <header style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 20%, #8b0000 60%, #d32f2f 100%)',
        color: 'white',
        padding: '0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
        borderBottom: '4px solid #ffd700',
        fontFamily: 'Impact, Arial Black, sans-serif'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '18px 25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s ease'
          }}>
            <span style={{
              fontSize: '3em',
              filter: 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5))'
            }}>🍔</span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: '1'
            }}>
              <span style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: '2.8em',
                fontWeight: 'bold',
                letterSpacing: '3px',
                color: '#ffd700',
                textShadow: '3px 3px 0px #8b0000, 6px 6px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)',
                marginBottom: '-5px'
              }}>ROUTE 66</span>
              <span style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: '1.4em',
                letterSpacing: '4px',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
              }}>BURGERS</span>
            </div>
          </Link>

          <nav style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/platos" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              textDecoration: 'none',
              padding: '15px 25px',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '1.1em',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.4s ease'
            }} onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.4))';
              e.target.style.borderColor = '#ffd700';
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.color = '#ffd700';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
            }} onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'none';
              e.target.style.color = 'white';
              e.target.style.boxShadow = 'none';
            }}>
              <span style={{ fontSize: '1.3em' }}>🍽️</span>
              MENÚ
            </Link>

            {user ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 25px',
                  background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.4))',
                  borderRadius: '30px',
                  border: '2px solid #ffd700',
                  color: '#ffd700',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1.1em'
                }}>
                  <span style={{ fontSize: '1.2em' }}>👋</span>
                  <span>¡HOLA, {user.name.toUpperCase()}!</span>
                </div>
                
                <Link href="/mis-pedidos" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '15px 25px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.4s ease'
                }} onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.4))';
                  e.target.style.borderColor = '#ffd700';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.color = '#ffd700';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
                }} onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'none';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = 'none';
                }}>
                  <span style={{ fontSize: '1.3em' }}>📋</span>
                  MIS PEDIDOS
                </Link>
                
                {user.admin && (
                  <Link href="/admin/setup" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px 25px',
                    borderRadius: '30px',
                    fontWeight: '600',
                    fontSize: '1.1em',
                    border: '2px solid #ff4444',
                    background: 'linear-gradient(45deg, #ff4444, #d32f2f)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: 'all 0.4s ease'
                  }} onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(45deg, #ff6666, #ff4444)';
                    e.target.style.transform = 'translateY(-3px) scale(1.08)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.4)';
                  }} onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(45deg, #ff4444, #d32f2f)';
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}>
                    <span style={{ fontSize: '1.3em' }}>⚙️</span>
                    ADMIN
                  </Link>
                )}
                
                <button onClick={handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 0, 0, 0.2))',
                  border: '2px solid rgba(255, 100, 100, 0.5)',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.4s ease'
                }} onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.5))';
                  e.target.style.borderColor = '#ff4444';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.3)';
                }} onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 0, 0, 0.2))';
                  e.target.style.borderColor = 'rgba(255, 100, 100, 0.5)';
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}>
                  <span style={{ fontSize: '1.3em' }}>🚪</span>
                  SALIR
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '15px 25px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.4s ease'
                }} onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.4))';
                  e.target.style.borderColor = '#ffd700';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.color = '#ffd700';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
                }} onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'none';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = 'none';
                }}>
                  <span style={{ fontSize: '1.3em' }}>🔐</span>
                  INICIAR SESIÓN
                </Link>
                <Link href="/register" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(45deg, #ffd700 0%, #ffeb3b 50%, #fff59d 100%)',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  padding: '15px 30px',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  border: '2px solid #ffd700',
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.4s ease'
                }} onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #ffeb3b 0%, #fff59d 50%, #ffffff 100%)';
                  e.target.style.transform = 'translateY(-5px) scale(1.08)';
                  e.target.style.boxShadow = '0 12px 30px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
                  e.target.style.color = '#1a1a1a';
                }} onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #ffd700 0%, #ffeb3b 50%, #fff59d 100%)';
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.color = '#1a1a1a';
                }}>
                  <span style={{ fontSize: '1.3em' }}>✨</span>
                  REGISTRARSE
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}