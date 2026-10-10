import { useState, useEffect } from 'react';
import * as configcat from 'configcat-js';
import { 
  Droplet, 
  Trash2, 
  Lightbulb, 
  Building2, 
  Search, 
  PhoneCall, 
  Calculator as CalcIcon, 
  CreditCard, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { TarjetaTramite } from './components/TarjetaTramite';
import { ConsultasPage } from './pages/ConsultasPage';

export function App({ children }: { children?: React.ReactNode }) {
  // Estados para Feature Flags
  const [isRestaEnabled, setIsRestaEnabled] = useState<boolean>(false);
  const [isPagosExpressEnabled, setIsPagosExpressEnabled] = useState<boolean>(false);

  // Estados Calculadora
  const [numA, setNumA] = useState<number>(0);
  const [numB, setNumB] = useState<number>(0);
  const [resultado, setResultado] = useState<number | null>(null);

  // Estados Pagos Express (Taller 6)
  const [pagoMensaje, setPagoMensaje] = useState<string>('');
  const [procesandoPago, setProcesandoPago] = useState<boolean>(false);

  useEffect(() => {
    // Inicialización del cliente de ConfigCat
    const client = configcat.getClient(
      'configcat-sdk-1/jhbfCK88XEuIbxj9FBfJZw/4-w6RhtbyUydt3-PRLDccQ',
      configcat.PollingMode.AutoPoll,
      { pollIntervalSeconds: 5 }
    );

    // 1. Evaluación de flag previa
    client.getValueAsync('isRestaEnabled', false).then((value) => {
      setIsRestaEnabled(value);
    });

    // 2. Evaluación de flag Taller 6: Pagos Express
    client.getValueAsync('pagos-express-v1', false).then((value) => {
      setIsPagosExpressEnabled(value);
    });

    return () => {
      client.dispose();
    };
  }, []);

  const handleProcesarPagoExpress = () => {
    setProcesandoPago(true);
    setTimeout(() => {
      setPagoMensaje('¡Transacción aprobada! Pago Express completado en 1 clic.');
      setProcesandoPago(false);
    }, 700);
  };

  const handleProcesarPagoTradicional = () => {
    setProcesandoPago(true);
    setTimeout(() => {
      setPagoMensaje('Formulario validado y pago procesado por pasarela estándar.');
      setProcesandoPago(false);
    }, 1200);
  };

  const tramites = [
    {
      id: 'agua-alcantarillado',
      titulo: 'Agua y Alcantarillado',
      descripcion: 'Atención prioritaria y reportes de fugas en vía pública, cortes de suministro no programados y mantenimiento de la red de alcantarillado.',
      categoria: 'fugas, cortes, alcantarillado',
      icon: <Droplet size={24} />
    },
    {
      id: 'recoleccion-basura',
      titulo: 'Recolección de Basura',
      descripcion: 'Consulta de rutas y horarios oficiales de recolección, reporte de acumulación de desechos y atención a puntos críticos comunitarios.',
      categoria: 'Horarios, acumulación, puntos críticos',
      icon: <Trash2 size={24} />
    },
    {
      id: 'alumbrado-publico',
      titulo: 'Alumbrado Público',
      descripcion: 'Mantenimiento preventivo y correctivo para lámparas apagadas, luminarias dañadas y sustitución o reparación de postes caídos.',
      categoria: 'lámparas apagadas, postes caídos',
      icon: <Lightbulb size={24} />
    }
  ];

  return (
    <div className="portal-container">
      {/* Header Institucional */}
      <header className="header-institucional">
        <div className="header-top-bar">
          <div className="container-inner top-bar-content">
            <span>Portal Oficial de Servicios Ciudadanos</span>
            <div className="header-contact">
              <PhoneCall size={14} />
              <span>Atención Ciudadana: 01 800 000 1234</span>
            </div>
          </div>
        </div>

        <div className="header-main container-inner">
          <div className="brand-institucional">
            <div className="escudo-icon">
              <Building2 size={28} />
            </div>
            <div className="brand-titles">
              <span className="gob-title">Gobierno Municipal</span>
              <h1 className="portal-name">Portal de Atención y Trámites</h1>
            </div>
          </div>

          <div className="header-search">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar trámite o servicio..." 
              aria-label="Buscar trámite o servicio"
            />
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content container-inner">
        {children ? (
          children
        ) : (
          <>
            {/* Widget Taller 6: Pagos Express (Feature Toggle: pagos-express-v1) */}
            <section style={{ 
              margin: '2rem 0', 
              padding: '1.5rem', 
              background: '#ffffff', 
              borderRadius: '8px', 
              border: '2px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CreditCard size={22} color="#1e293b" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>
                    Caja Virtual de Trámites
                  </h3>
                </div>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: isPagosExpressEnabled ? '#dcfce7' : '#f1f5f9',
                  color: isPagosExpressEnabled ? '#15803d' : '#475569',
                  fontWeight: 600
                }}>
                  Toggle pagos-express-v1: {isPagosExpressEnabled ? 'ACTIVO (ON)' : 'INACTIVO (OFF)'}
                </span>
              </div>

              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.95rem' }}>
                Total a liquidar por concepto de trámite catastral: <strong>$50.000 COP</strong>
              </p>

              {/* Si el flag pagos-express-v1 está activo, muestra la opción rápida */}
              {isPagosExpressEnabled ? (
                <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: '#166534', fontWeight: 600 }}>
                    <Zap size={18} />
                    <span>¡Pagos Express Habilitado!</span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#15803d' }}>
                    Paga de inmediato sin ingresar datos bancarios adicionales usando tu firma digital registrada.
                  </p>
                  <button
                    onClick={handleProcesarPagoExpress}
                    disabled={procesandoPago}
                    style={{
                      padding: '10px 18px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Zap size={16} />
                    {procesandoPago ? 'Procesando pago seguro...' : 'Pagar en 1 Clic con Pagos Express'}
                  </button>
                </div>
              ) : (
                /* Flujo tradicional cuando el flag está en OFF */
                <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569' }}>
                    Flujo convencional: Diligencie el formulario con sus datos de tarjeta o PSE.
                  </p>
                  <button
                    onClick={handleProcesarPagoTradicional}
                    disabled={procesandoPago}
                    style={{
                      padding: '10px 18px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {procesandoPago ? 'Cargando pasarela bancaria...' : 'Completar formulario y Pagar'}
                  </button>
                </div>
              )}

              {pagoMensaje && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '10px', 
                  backgroundColor: '#eff6ff', 
                  border: '1px solid #bfdbfe', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1d4ed8',
                  fontSize: '0.9rem'
                }}>
                  <CheckCircle2 size={18} />
                  <span>{pagoMensaje}</span>
                </div>
              )}
            </section>

            {/* Widget Calculadora con Feature Flag (isRestaEnabled) */}
            <section style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <CalcIcon size={20} />
                <h3 style={{ margin: 0 }}>Calculadora de Liquidación (TBD Demo)</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  value={numA}
                  onChange={(e) => setNumA(Number(e.target.value))}
                  style={{ padding: '6px 10px', width: '100px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="number"
                  value={numB}
                  onChange={(e) => setNumB(Number(e.target.value))}
                  style={{ padding: '6px 10px', width: '100px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <button
                  onClick={() => setResultado(numA + numB)}
                  style={{ padding: '6px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Sumar
                </button>
                {/* Botón de Resta expuesto solo si el flag isRestaEnabled está activo */}
                {isRestaEnabled && (
                  <button
                    onClick={() => setResultado(numA - numB)}
                    style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Restar
                  </button>
                )}
              </div>
              {resultado !== null && (
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Resultado: {resultado}</p>
              )}
            </section>

            {/* Catálogo de Trámites */}
            <section className="respuestas-section">
              <div className="section-header">
                <h2 className="title-respuestas">Respuestas</h2>
                <p className="subtitle-respuestas">
                  Seleccione una categoría para consultar información, horarios y realizar reportes ciudadanos en línea.
                </p>
              </div>

              <div className="tramites-grid">
                {tramites.map((tramite) => (
                  <TarjetaTramite
                    key={tramite.id}
                    titulo={tramite.titulo}
                    descripcion={tramite.descripcion}
                    categoria={tramite.categoria}
                    icon={tramite.icon}
                  />
                ))}
              </div>
            </section>

            {/* Página de Consultas */}
            <section className="consultas-section" style={{ marginTop: '3rem' }}>
              <ConsultasPage />
            </section>
          </>
        )}
      </main>

      {/* Footer Institucional */}
      <footer className="footer-institucional">
        <div className="container-inner footer-content">
          <p>© {new Date().getFullYear()} Gobierno Municipal. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#privacidad">Aviso de Privacidad</a>
            <a href="#contacto">Contacto</a>
            <a href="#terminos">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;