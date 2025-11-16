import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { usuario, token } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('userName', usuario.nombre);
      localStorage.setItem('userRole', usuario.admin ? 'admin' : 'user');
      
      setMessage('¡Bienvenido de vuelta! Redirigiendo...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Error de login:', err);
      setMessage('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <Head>
        <title>Iniciar Sesión | Route 66 Burgers</title>
        <meta name="description" content="Inicia sesión en Route 66 Burgers para hacer tus pedidos" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="main">
        <div className="container">
          <div className="loginCard">
            <div className="cardHeader">
              <div className="logo">
                <span className="logoIcon">🍔</span>
                <h1>Route 66 Burgers</h1>
              </div>
              <h2>¡Bienvenido de vuelta!</h2>
              <p>Inicia sesión para continuar tu viaje gastronómico</p>
            </div>

            <form onSubmit={handleSubmit} className="loginForm">
              <div className="formGroup">
                <label className="formLabel">
                  <span className="labelIcon">📧</span>
                  Email
                </label>
                <input
                  type="email"
                  className="formInput"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label className="formLabel">
                  <span className="labelIcon">🔒</span>
                  Contraseña
                </label>
                <input
                  type="password"
                  className="formInput"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {message && (
                <div className={`message ${message.includes('Bienvenido') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="submitBtn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span className="btnIcon">🚀</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="cardFooter">
              <p>¿No tienes cuenta?</p>
              <Link href="/register" className="registerLink">
                ✨ Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .loginPage {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #1a1a1a 0%,
            #2d2d2d 25%,
            #d32f2f 50%,
            #2d2d2d 75%,
            #1a1a1a 100%
          );
          background-attachment: fixed;
        }

        .main {
          padding: 60px 20px;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 450px;
          margin: 0 auto;
        }

        .loginCard {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 3px solid #ffd700;
          position: relative;
          overflow: hidden;
        }

        .loginCard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #d32f2f, #ffd700, #d32f2f);
          animation: shimmer 2s ease-in-out infinite;
        }

        .cardHeader {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .logoIcon {
          font-size: 3em;
          animation: bounce 2s infinite;
        }

        .logo h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5em;
          color: #d32f2f;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          letter-spacing: 3px;
        }

        .cardHeader h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2em;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .cardHeader p {
          color: #666;
          font-size: 1.1em;
        }

        .loginForm {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
        }

        .formLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
          font-size: 1.1em;
        }

        .labelIcon {
          font-size: 1.2em;
        }

        .formInput {
          padding: 15px 20px;
          border: 3px solid #ddd;
          border-radius: 15px;
          font-size: 1.1em;
          transition: all 0.3s ease;
          background: white;
        }

        .formInput:focus {
          outline: none;
          border-color: #d32f2f;
          box-shadow: 0 0 20px rgba(211, 47, 47, 0.3);
          transform: translateY(-2px);
        }

        .message {
          padding: 15px;
          border-radius: 15px;
          text-align: center;
          font-weight: bold;
        }

        .message.success {
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          color: white;
        }

        .message.error {
          background: linear-gradient(45deg, #f44336, #ff9800);
          color: white;
        }

        .submitBtn {
          padding: 18px;
          background: linear-gradient(45deg, #d32f2f, #ff4444);
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .submitBtn:hover:not(:disabled) {
          background: linear-gradient(45deg, #b71c1c, #d32f2f);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(211, 47, 47, 0.4);
        }

        .submitBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btnIcon {
          font-size: 1.2em;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .cardFooter {
          text-align: center;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px dashed #ddd;
        }

        .cardFooter p {
          color: #666;
          margin-bottom: 15px;
        }

        .registerLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d32f2f;
          text-decoration: none;
          font-weight: bold;
          padding: 12px 25px;
          border: 2px solid #d32f2f;
          border-radius: 25px;
          transition: all 0.3s ease;
          background: transparent;
        }

        .registerLink:hover {
          background: #d32f2f;
          color: white;
          transform: translateY(-2px);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 480px) {
          .main {
            padding: 20px;
          }

          .loginCard {
            padding: 30px 25px;
          }

          .logo h1 {
            font-size: 2em;
          }

          .cardHeader h2 {
            font-size: 1.6em;
          }
        }
      `}</style>
    </div>
  );
}
