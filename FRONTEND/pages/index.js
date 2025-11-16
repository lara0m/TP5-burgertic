import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="homepage">
      <Head>
        <title>Route 66 Burgers - Las Mejores Hamburguesas Americanas</title>
        <meta name="description" content="Disfruta de auténticas hamburguesas americanas en Route 66 Burgers. ¡La mejor experiencia gastronómica!" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bungee&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="main">
        {/* Hero Section */}
        <section className={`hero ${isLoaded ? 'loaded' : ''}`}>
          <div className="heroContent">
            <div className="heroText">
              <h1 className="heroTitle">
                <span className="titleLine1">🛣️ ROUTE 66</span>
                <span className="titleLine2">BURGERS</span>
                <span className="titleLine3">🍔</span>
              </h1>
              <p className="heroSubtitle">
                ¡La auténtica experiencia americana! <br/>
                Hamburguesas legendarias desde 1950
              </p>
              <div className="heroButtons">
                <Link href="/platos" className="ctaButton primary">
                  <span className="btnIcon">🍽️</span>
                  Ver Menú
                </Link>
                <Link href="/register" className="ctaButton secondary">
                  <span className="btnIcon">⭐</span>
                  ¡Únete Ahora!
                </Link>
              </div>
            </div>
            <div className="heroVisual">
              <div className="burgerAnimation">
                <div className="burger">
                  <div className="bun-top">🍞</div>
                  <div className="lettuce">🥬</div>
                  <div className="tomato">🍅</div>
                  <div className="meat">🥩</div>
                  <div className="cheese">🧀</div>
                  <div className="bun-bottom">🍞</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="heroDecoration">
            <div className="roadLine"></div>
            <div className="roadLine"></div>
            <div className="roadLine"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="sectionTitle">🌟 ¿Por qué elegir Route 66 Burgers?</h2>
            <div className="featuresGrid">
              <div className="featureCard">
                <div className="featureIcon">🥩</div>
                <h3>Carne Premium</h3>
                <p>Carne 100% Angus, fresca y de la más alta calidad</p>
              </div>
              <div className="featureCard">
                <div className="featureIcon">🔥</div>
                <h3>Receta Secreta</h3>
                <p>Más de 70 años perfeccionando nuestras recetas</p>
              </div>
              <div className="featureCard">
                <div className="featureIcon">⚡</div>
                <h3>Entrega Rápida</h3>
                <p>Pedidos listos en tiempo récord, sin sacrificar calidad</p>
              </div>
              <div className="featureCard">
                <div className="featureIcon">🇺🇸</div>
                <h3>Auténtico Americano</h3>
                <p>La verdadera experiencia de un diner de la Route 66</p>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="specialties">
          <div className="container">
            <h2 className="sectionTitle">🏆 Nuestras Especialidades</h2>
            <div className="specialtiesGrid">
              <div className="specialtyCard">
                <div className="specialtyImage">🍔</div>
                <h3>Big Route Burger</h3>
                <p>La hamburguesa más grande del oeste</p>
                <span className="price">$15.99</span>
              </div>
              <div className="specialtyCard">
                <div className="specialtyImage">🍟</div>
                <h3>Combo Highway</h3>
                <p>Hamburguesa + papas + bebida</p>
                <span className="price">$12.99</span>
              </div>
              <div className="specialtyCard">
                <div className="specialtyImage">🥤</div>
                <h3>Shake de Ruta</h3>
                <p>Batido cremoso estilo vintage</p>
                <span className="price">$5.99</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="ctaContent">
              <h2>🚗 ¡Súbete al viaje gastronómico!</h2>
              <p>Únete a miles de viajeros que ya probaron nuestras hamburguesas</p>
              <Link href="/register" className="ctaButton mega">
                <span className="btnIcon">🎯</span>
                ¡Comenzar mi viaje!
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footerContent">
            <div className="footerLogo">
              <span className="logoIcon">🍔</span>
              <span>Route 66 Burgers</span>
            </div>
            <div className="footerText">
              <p>© 2025 Route 66 Burgers. La experiencia americana más auténtica.</p>
              <p>🛣️ Desde el corazón de la Mother Road hasta tu mesa</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #0a0a0a;
          color: white;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .homepage {
          min-height: 100vh;
          position: relative;
        }

        .main {
          position: relative;
          z-index: 1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0a0a0a 0%,
            #1a1a1a 20%,
            #2d1b1b 40%,
            #8b0000 60%,
            #d32f2f 80%,
            #ff4444 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transform: translateY(20px);
          opacity: 0;
          transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background-attachment: fixed;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(211, 47, 47, 0.1) 0%, transparent 40%),
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
          pointer-events: none;
        }

        .hero.loaded {
          transform: translateY(0);
          opacity: 1;
        }

        .heroContent {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 20px;
          z-index: 2;
          position: relative;
        }

        .heroTitle {
          display: flex;
          flex-direction: column;
          font-family: 'Bebas Neue', sans-serif;
          text-align: left;
          margin-bottom: 30px;
        }

        .titleLine1 {
          font-size: 3.5em;
          color: #ffd700;
          text-shadow: 
            3px 3px 0px #8b0000,
            6px 6px 10px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(255, 215, 0, 0.5);
          letter-spacing: 12px;
          animation: slideInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
          line-height: 0.9;
          margin-bottom: 10px;
        }

        .titleLine2 {
          font-size: 5.5em;
          color: white;
          text-shadow: 
            4px 4px 0px #d32f2f,
            8px 8px 15px rgba(0, 0, 0, 0.9),
            0 0 40px rgba(255, 255, 255, 0.3);
          letter-spacing: 16px;
          animation: slideInRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
          line-height: 0.9;
          margin-bottom: 20px;
        }

        .titleLine3 {
          font-size: 4em;
          animation: bounce 2.5s ease-in-out 1.2s infinite;
          align-self: flex-end;
          margin-right: 50px;
        }

        .heroSubtitle {
          font-size: 1.4em;
          text-align: left;
          color: #ffd700;
          margin-bottom: 50px;
          line-height: 1.6;
          animation: fadeInUp 1s ease 1.5s both;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
          font-weight: 300;
          letter-spacing: 1px;
        }

        .heroButtons {
          display: flex;
          gap: 25px;
          justify-content: flex-start;
          animation: fadeInUp 1s ease 1.8s both;
          flex-wrap: wrap;
        }

        .ctaButton {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 40px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.2em;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
          border: 3px solid transparent;
          font-family: 'Bebas Neue', sans-serif;
        }

        .ctaButton::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.8s ease;
        }

        .ctaButton:hover::before {
          left: 100%;
        }

        .ctaButton.primary {
          background: linear-gradient(45deg, #ffd700 0%, #ffeb3b 50%, #fff59d 100%);
          color: #1a1a1a;
          border-color: #ffd700;
          box-shadow: 
            0 8px 25px rgba(255, 215, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .ctaButton.primary:hover {
          background: linear-gradient(45deg, #ffeb3b 0%, #fff59d 50%, #ffffff 100%);
          transform: translateY(-5px) scale(1.05);
          box-shadow: 
            0 15px 40px rgba(255, 215, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          color: #1a1a1a;
        }

        .ctaButton.secondary {
          background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
          color: white;
          border-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .ctaButton.secondary:hover {
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.9) 100%);
          color: #1a1a1a;
          transform: translateY(-5px) scale(1.05);
          border-color: white;
        }

        .btnIcon {
          font-size: 1.3em;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
        }

        .heroVisual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .burgerAnimation {
          position: relative;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.5));
        }

        .burger {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 4em;
          position: relative;
        }

        .burger > div {
          margin: -8px 0;
          animation: stackUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4));
        }

        .burger > div:nth-child(1) { animation-delay: 0.2s; }
        .burger > div:nth-child(2) { animation-delay: 0.4s; }
        .burger > div:nth-child(3) { animation-delay: 0.6s; }
        .burger > div:nth-child(4) { animation-delay: 0.8s; }
        .burger > div:nth-child(5) { animation-delay: 1.0s; }
        .burger > div:nth-child(6) { animation-delay: 1.2s; }

        .heroDecoration {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          pointer-events: none;
          z-index: 1;
        }

        .roadLine {
          position: absolute;
          bottom: 30px;
          left: 0;
          width: 100%;
          height: 6px;
          background: #ffd700;
          opacity: 0.8;
          box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
        }

        .roadLine:nth-child(2) {
          bottom: 45px;
          background: linear-gradient(90deg, transparent 0%, white 20%, transparent 40%, white 60%, transparent 80%, white 100%);
          height: 3px;
          animation: roadMove 4s linear infinite;
        }

        .roadLine:nth-child(3) {
          bottom: 15px;
          background: linear-gradient(90deg, transparent 0%, white 30%, transparent 50%, white 70%, transparent 100%);
          height: 3px;
          animation: roadMove 4s linear infinite reverse;
        }

        /* Sections */
        .features, .specialties, .cta {
          padding: 120px 0;
          position: relative;
        }

        .features {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
        }

        .specialties {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%);
        }

        .cta {
          background: linear-gradient(135deg, #8b0000 0%, #d32f2f 50%, #ff4444 100%);
          text-align: center;
        }

        .sectionTitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5em;
          text-align: center;
          margin-bottom: 80px;
          color: #ffd700;
          text-shadow: 
            3px 3px 0px #8b0000,
            6px 6px 15px rgba(0, 0, 0, 0.8);
          letter-spacing: 4px;
        }

        .featuresGrid, .specialtiesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .featureCard, .specialtyCard {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          padding: 50px 35px;
          border-radius: 25px;
          text-align: center;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }

        .featureCard::before, .specialtyCard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.1) 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .featureCard:hover::before, .specialtyCard:hover::before {
          opacity: 1;
        }

        .featureCard:hover, .specialtyCard:hover {
          transform: translateY(-15px) scale(1.03);
          border-color: #ffd700;
          box-shadow: 
            0 25px 50px rgba(255, 215, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .featureIcon, .specialtyImage {
          font-size: 5em;
          margin-bottom: 25px;
          display: block;
          filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
        }

        .featureCard h3, .specialtyCard h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2em;
          margin-bottom: 20px;
          color: #ffd700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
        }

        .featureCard p, .specialtyCard p {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          margin-bottom: 20px;
          font-size: 1.1em;
        }

        .price {
          font-size: 2em;
          font-weight: bold;
          color: #ffd700;
          font-family: 'Bebas Neue', sans-serif;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
        }

        /* Footer */
        .footer {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          border-top: 4px solid #ffd700;
          padding: 60px 0;
          position: relative;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #d32f2f, #ffd700, #d32f2f);
        }

        .footerContent {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footerLogo {
          display: flex;
          align-items: center;
          gap: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8em;
          color: #ffd700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          letter-spacing: 2px;
        }

        .footerLogo .logoIcon {
          font-size: 2em;
          animation: pulse 2s ease-in-out infinite;
        }

        .footerText {
          text-align: right;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        .footerText p {
          margin-bottom: 8px;
          font-size: 1.1em;
        }

        /* Animations */
        @keyframes slideInLeft {
          from {
            transform: translateX(-150px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(150px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(60px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          40% {
            transform: translateY(-20px) rotate(-5deg);
          }
          60% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
          }
          50% {
            transform: translateY(-25px) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-2deg);
          }
        }

        @keyframes stackUp {
          from {
            transform: translateY(150px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes roadMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 200px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .heroContent {
            gap: 60px;
          }

          .titleLine1 {
            font-size: 3em;
            letter-spacing: 8px;
          }

          .titleLine2 {
            font-size: 4.5em;
            letter-spacing: 12px;
          }
        }

        @media (max-width: 768px) {
          .heroContent {
            grid-template-columns: 1fr;
            gap: 50px;
            text-align: center;
            padding: 80px 20px;
          }

          .heroTitle {
            text-align: center;
          }

          .heroSubtitle {
            text-align: center;
          }

          .heroButtons {
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }

          .titleLine1 {
            font-size: 2.5em;
            letter-spacing: 6px;
          }

          .titleLine2 {
            font-size: 3.8em;
            letter-spacing: 8px;
          }

          .featuresGrid, .specialtiesGrid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footerContent {
            flex-direction: column;
            gap: 30px;
            text-align: center;
          }

          .footerText {
            text-align: center;
          }

          .burger {
            font-size: 3em;
          }
        }

        @media (max-width: 480px) {
          .titleLine1 {
            font-size: 2em;
            letter-spacing: 4px;
          }

          .titleLine2 {
            font-size: 2.8em;
            letter-spacing: 6px;
          }

          .titleLine3 {
            font-size: 2.5em;
          }

          .heroSubtitle {
            font-size: 1.2em;
          }

          .ctaButton {
            padding: 18px 30px;
            font-size: 1.1em;
            width: 100%;
            max-width: 300px;
          }

          .sections {
            padding: 80px 0;
          }

          .sectionTitle {
            font-size: 2.5em;
          }

          .burger {
            font-size: 2.5em;
          }

          .heroContent {
            padding: 60px 15px;
          }
        }
      `}</style>
    </div>
  );
}
