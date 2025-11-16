import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { register as apiRegister } from '../services/api';

export default function Register(){
  const [form, setForm] = useState({nombre:'', apellido:'', email:'', password:''});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try{
      await apiRegister(form);
      setMessage('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch(err){
      console.error('Error de registro:', err);
      setMessage('Error al registrarse. Intenta con otro email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <Head>
        <title>Registrarse | Route 66 Burgers</title>
        <meta name="description" content="Únete a Route 66 Burgers y disfruta de las mejores hamburguesas" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="main">
        <div className="container">
          <div className="registerCard">
            <div className="cardHeader">
              <div className="logo">
                <span className="logoIcon">🍔</span>
                <h1>Route 66 Burgers</h1>
              </div>
              <h2>¡Únete a la familia!</h2>
              <p>Comienza tu viaje gastronómico por la legendaria Route 66</p>
            </div>

            <form onSubmit={handleSubmit} className="registerForm">
              <div className="formGroup">
                <label className="formLabel">
                  <span className="labelIcon">👤</span>
                  Nombre
                </label>
                <input
                  type="text"
                  className="formInput"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label className="formLabel">
                  <span className="labelIcon">👥</span>
                  Apellido
                </label>
                <input
                  type="text"
                  className="formInput"
                  name="apellido"
                  placeholder="Tu apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label className="formLabel">
                  <span className="labelIcon">📧</span>
                  Email
                </label>
                <input
                  type="email"
                  className="formInput"
                  name="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {message && (
                <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
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
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <span className="btnIcon">✨</span>
                    ¡Comenzar mi viaje!
                  </>
                )}
              </button>
            </form>

            <div className="cardFooter">
              <p>¿Ya tienes cuenta?</p>
              <Link href="/login" className="loginLink">
                🔐 Inicia sesión aquí
              </Link>
            </div>

            <div className="benefits">
              <h3>🎆 Beneficios de unirte:</h3>
              <ul>
                <li>🍔 Acceso a menú exclusivo</li>
                <li>⚡ Pedidos rápidos y seguros</li>
                <li>📋 Historial de pedidos</li>
                <li>🎯 Ofertas especiales</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .registerPage {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #1a1a1a 0%,
            #2d2d2d 20%,
            #d32f2f 40%,
            #ff6b6b 60%,
            #2d2d2d 80%,
            #1a1a1a 100%
          );
          background-attachment: fixed;
        }

        .main {
          padding: 40px 20px;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .registerCard {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
          border: 3px solid #ffd700;
          position: relative;
          overflow: hidden;
        }

        .registerCard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #d32f2f, #ffd700, #ff6b6b, #ffd700, #d32f2f);
          background-size: 200% 100%;
          animation: gradientShift 3s ease-in-out infinite;
        }

        .cardHeader {
          text-align: center;
          margin-bottom: 35px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .logoIcon {
          font-size: 3.5em;
          animation: rotate360 4s linear infinite;
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
          font-size: 2.2em;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .cardHeader p {
          color: #666;
          font-size: 1.1em;
          line-height: 1.4;
        }

        .registerForm {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
        }

        .formGroup:nth-child(3), .formGroup:nth-child(4) {
          grid-column: 1 / -1;
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
          font-size: 1.3em;
        }

        .formInput {
          padding: 16px 20px;
          border: 3px solid #ddd;
          border-radius: 15px;
          font-size: 1.1em;
          transition: all 0.3s ease;
          background: white;
        }

        .formInput:focus {
          outline: none;
          border-color: #d32f2f;
          box-shadow: 0 0 25px rgba(211, 47, 47, 0.3);
          transform: translateY(-2px);
        }

        .message {
          grid-column: 1 / -1;
          padding: 16px;
          border-radius: 15px;
          text-align: center;
          font-weight: bold;
          font-size: 1.1em;
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
          grid-column: 1 / -1;
          padding: 20px;
          background: linear-gradient(45deg, #ffd700, #ffeb3b);
          color: #1a1a1a;
          border: 3px solid #ffd700;
          border-radius: 15px;
          font-size: 1.3em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
          margin-top: 10px;
        }

        .submitBtn:hover:not(:disabled) {
          background: linear-gradient(45deg, #ffeb3b, #fff59d);
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.5);
        }

        .submitBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btnIcon {
          font-size: 1.3em;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .cardFooter {
          text-align: center;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 2px dashed #ddd;
        }

        .cardFooter p {
          color: #666;
          margin-bottom: 15px;
        }

        .loginLink {
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

        .loginLink:hover {
          background: #d32f2f;
          color: white;
          transform: translateY(-2px);
        }

        .benefits {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(211, 47, 47, 0.1));
          border-radius: 15px;
          border: 2px dashed #ffd700;
        }

        .benefits h3 {
          font-family: 'Bebas Neue', sans-serif;
          color: #d32f2f;
          margin-bottom: 15px;
          font-size: 1.4em;
        }

        .benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .benefits li {
          color: #333;
          font-weight: 500;
        }

        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 600px) {
          .registerForm {
            grid-template-columns: 1fr;
          }
          
          .formGroup:nth-child(3), .formGroup:nth-child(4) {
            grid-column: 1;
          }

          .benefits ul {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .main {
            padding: 20px;
          }

          .registerCard {
            padding: 30px 25px;
          }

          .logo h1 {
            font-size: 2em;
          }

          .cardHeader h2 {
            font-size: 1.8em;
          }

          .submitBtn {
            font-size: 1.1em;
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
